import { cache } from "react";
import { PrismaClient, Prisma, UserWordsListProgress } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";

const prisma = new PrismaClient();

export const getUserWordListsWithMasteries = cache(async (userID: string, classID: string) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: { 
      userId: userID ,
      classId: classID,
    },
    include:{
      userWordMasteries: {
        orderBy: { masteryScore: 'desc'},
        include: { word: true }
      },
      wordsList: true,
      }
    });
  return data;
})
export const getUserWordLists = cache(async (userID: string) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: { userId: userID },
    include: { wordsList: true },
  });
  return data;
});

export const getUserClassWordLists = cache(async (userID: string, classID: string) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: { 
      userId: userID,
      classId: classID,
    },
    include: { wordsList: true },
  });
  return data;
});
export const getWordList = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    include: { words: true },
  });

  return data;
});

export const getUserWordListProgress = cache(
  async (userID: string, wordListID: string) => {
    const data = await prisma.userWordsListProgress.findFirst({
      where: { userId: userID, wordsListListId: wordListID },
      include: { quizzes: 
        {
          orderBy: { quizId: 'asc'},
        },
      },
    });
    return data;
  },
);
// export async function getUserWordListProgress(userID: string, wordListID: string) : Promise<UserWordsListProgress | null> {
//     const data = await prisma.userWordsListProgress.findFirst({
//         where: { userId: userID, wordsListListId: wordListID },
//         include: { userQuizProgresses: true}
//     });
//     return data;
// }

// TODO: temporary getwords to test. Change this later
export const getWords = cache(async () => {
  const data = await prisma.word.findMany({
    take: 10,
  });
  return data;
});
export const getWordListWords = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    include: { words: true },
  });
  const words = data?.words;
  console.log(words);
  return words;
});
export const getUserQuizzes = cache(async (userID: string) => {
  const data = await prisma.quiz.findMany({
    where: { userId: userID },
    select: { quizId: true, learnCompleted: true },
  });
  return data;
});
export const getQuiz = cache(async (quizID: string) => {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    include: {
      questions: true,
    },
  });
  if (!quiz) {
    throw Error("Quiz not found");
  }
  return quiz;
});

export const getQuizzesFromWordsList = cache(async (wordListID: string, userId: string) => {
  const quizzes = await prisma.quiz.findMany({
    where: {
      wordsListId: wordListID,
      userId: userId,
      completed: true,
    },
    orderBy:{
      createdAt: 'desc'
    }
  });
  return quizzes;
});

export const getQuizWords = cache(async (quizID: string) => {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    select: {
      questions:{
        select:{
          word: true
        }
      }
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return quiz.questions.map((question) => question.word);
});
