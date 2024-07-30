import {
  PrismaClient,
  PublishedList,
  UserQuizProgress,
  UserWordsListProgress,
  Word,
  WordsList,
} from "@prisma/client";
import { UserQuizProgressWithQuiz } from "@/prisma/types";

const prisma = new PrismaClient();

export async function getUserWordLists(
  userID: string,
): Promise<PublishedList[]> {
  const data = await prisma.publishedList.findMany({
    where: { userId: userID },
    include: { list: true },
  });
  return data;
}

export async function getWordList(
  wordListID: string,
): Promise<WordsList | null> {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    include: { words: true },
  });
  return data;
}

export async function getUserWordListProgress(
  userID: string,
  wordListID: string,
) {
  const data = await prisma.userWordsListProgress.findFirst({
    where: { userId: userID, wordsListListId: wordListID },
    include: { userQuizProgresses: true },
  });
  return data;
}

// TODO: temporary getwords to test. Change this later
export async function getWords(): Promise<Word[]> {
  const data = await prisma.word.findMany({
    take: 10,
  });
  return data;
}

export async function getWordListWords(wordListID: string): Promise<Word[]> {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    include: { words: true },
  });
  const words = data!.words;
  return words;
}

export async function getUserQuizzes(userID: string) {
  const data = await prisma.userQuizProgress.findMany({
    where: { userId: userID },
    select: { quizQuizId: true, learnCompleted: true },
  });
  return data;
}

export async function getUserQuizProgress(
  userID: string,
  quizID: string,
): Promise<UserQuizProgressWithQuiz | null> {
  const data = await prisma.userQuizProgress.findFirst({
    where: { userId: userID, quizQuizId: quizID },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              answers: true,
              userQuestionProgress: {
                where: {
                  userId: userID,
                },
              },
            },
            orderBy: {
              questionId: "asc",
            },
          },
        },
      },
    },
  });
  return data;
}

export async function getQuiz(quizID: string) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
        orderBy: {
          questionId: "asc",
        },
      },
    },
  });
  if (!quiz) {
    throw Error("Quiz not found");
  }
  return quiz;
}

export async function getQuestions(quizID: string) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
        orderBy: {
          questionId: "asc",
        },
      },
    },
  });
  if (!quiz) {
    throw Error("Quiz not found");
  }
  return quiz.questions;
}

export async function getQuizWords(quizID: string) {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    select: {
      words: true,
    },
  });
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return quiz.words;
}
