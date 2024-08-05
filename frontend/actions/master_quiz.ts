"use server";
import { auth } from "@/auth/auth";
import { PrismaClient, QuizType } from "@prisma/client";
import { upsertQuestionCompleted } from "./quiz_progress";
import { Ruge_Boogie } from "next/font/google";
const prisma = new PrismaClient();

export const masteryAvailable = async (wordListId: string, userId: string) => {
  const wordList = await prisma.wordsList.findFirst({
    where: {
      listId: wordListId,
    },
    include: {
      quizzes: {
        where: {
          quizType: QuizType.MINI,
        },
      },
    },
  });
  if (!wordList) {
    throw new Error("Word list not found");
  }
  for (const miniQuiz of wordList.quizzes) {
    const userQuiz = await prisma.userQuizProgress.findFirst({
      where: {
        userId: userId,
        quizQuizId: miniQuiz.quizId,
      },
      select: {
        completed: true,
      },
    });
    if (!userQuiz) {
      throw new Error("User quiz not found, quizId: " + miniQuiz.quizId);
    }
    if (!userQuiz.completed) {
      return false;
    }
  }
  return true;
};

export const createOrGetMasterQuiz = async (wordListId: string, userId: string) => {
  const currMasterQuiz = await prisma.quiz.findFirst({
    where:{
      quizType: QuizType.MASTERY,
      wordsListListId: wordListId,
    },
    select:{
      UserQuizProgress:{
        where:{
          userId: userId,
        },
      },
      quizId: true,
    },
  });
  // if an uncompleted master quiz exists already, return that
  if (currMasterQuiz && !currMasterQuiz.UserQuizProgress[0].completed){
    console.log("existing quiz found")
    return currMasterQuiz;
  }
  // otherwise, it's either been created or completed, in which case we create a new quiz
  // DELETING THIS QUIZ IS DELETING ALL THE QUESTIONS, WHICH WE DO NOT WANT
  else if(currMasterQuiz){
    await prisma.quiz.delete({
      where:{
        quizId: currMasterQuiz.quizId,
      }
    });
  }
  const userWordListProgress = await prisma.userWordsListProgress.findFirst({
    where: {
      userId: userId,
      wordsListListId: wordListId,
    },
    include: {
      wordsList: {
        include: {
          words: {
            include: {
              questions: true,
            },
          },
        },
      },
    },
  });
  if (!userWordListProgress) {
    throw new Error("User word list progress not found");
  }
  const wordList = userWordListProgress.wordsList;

  const words = wordList.words;
  // retrieve the 5 words with the lowest mastery score from other lists
  const oldWords = await prisma.userWordMastery.findMany({
    where: {
      userId: userId,
      word: {
        listId: {
          not: wordListId,
        },
      },
    },
    orderBy: {
      masteryScore: "asc",
    },
    select: {
      word: {
        include: {
          questions: true,
        },
      },
    },
    take: 5,
  });
  let questions = [];
  for (const word of words) {
    const question = word.questions[0];
    const userQuestion = await prisma.userQuestionProgress.findFirst({
      where: {
        userId: userId,
        questionQuestionId: question.questionId,
      },
      select: {
        userQuestionProgressId: true,
      },
    });
    if (!userQuestion) {
      throw new Error("User question not found");
    }
    upsertQuestionCompleted(userQuestion.userQuestionProgressId, false);

    questions.push(question);
  }
  for (const word of oldWords) {
    const question = word.word.questions[0];
    const userQuestion = await prisma.userQuestionProgress.findFirst({
      where: {
        userId: userId,
        questionQuestionId: question.questionId,
      },
      select: {
        userQuestionProgressId: true,
      },
    });
    if (!userQuestion) {
      throw new Error("User question not found");
    }
    upsertQuestionCompleted(userQuestion.userQuestionProgressId, false);
    questions.push(question);
  }
  // create quiz
  const masterQuiz = await prisma.quiz.create({
    data: {
      quizType: QuizType.MASTERY,
      questions: {
        connect: questions.map((question) => ({
          questionId: question.questionId,
        })),
      },
      words: {
        connect: questions.map((question) => ({ wordId: question.wordId })),
      },
      WordsList: {
        connect: {
          listId: wordListId,
        },
      },
      UserQuizProgress: {
        create: [
          {
            userId: userId,
            completed: false,
            score: 0,
            randomSeed: Math.floor(Math.random() * 1000),
            wordListProgressId: userWordListProgress.userWordsListProgressId,
          },
        ],
      },
    },
  });
  console.log("New quiz created")
  return masterQuiz;
};
