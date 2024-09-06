import { cache } from "react";
import { UserWordsListProgress } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";
import prisma from "./prisma";

export const getListSize = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: {
      listId: wordListID,
    },
    select: {
      words: true
    },
  });

  if (!data) {
    throw new Error("Word list not found");
  }
  return data.words.length;
});
export const getUserRole = cache(async (userId: string) => {
  const data = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select:{
      role: true
    }
  });
  if (!data) {
    throw new Error("User not found");
  }
  return data.role;
});
export const getClass = cache(async (classId: string) => {
  const data = await prisma.class.findFirst({
    where: {
      classId: classId,
    },
  });
  return data;
});

export const getClassPeople = cache(async (classId: string) => {
  const data = await prisma.class.findFirst({
    where: {
      classId: classId,
    },
    select: {
      students: true,
      teacherId: true,
    },
  });
  return data;
});
export const getAllWordsListsAssigned = cache(async (classId: string) => {
  const data = await prisma.wordsList.findMany({
    where: {
      UserWordsListProgress: {
        some: {
          classId: classId
        }
      }
    },
    include: {
      words: true,
      UserWordsListProgress: true,
    },
    orderBy: {
      listNumber: 'asc',
    }
  });
  return data;
})

export const getAllWordListsNotAssigned = cache(async (classId: string) =>{
  const data = await prisma.wordsList.findMany({
    where: {
      UserWordsListProgress: {
        none: {
          classId: classId
        }
      }
    },
    include: {
      words: true,
      UserWordsListProgress: true,
    },
    orderBy: {
      listNumber: 'asc',
    }
    
  });
  return data;
})

export const getWordListName = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    select: { name: true },
  });
  return data;
});
export const getListNameAndDueDate = cache(async (classId: string, wordListID: string) => {
  const data = await prisma.userWordsListProgress.findFirst({
    where: {
      classId: classId,
      wordsListListId: wordListID,
    },
    include: { wordsList: true },
  });
  return {name: data?.wordsList.name, dueDate: data?.dueDate};
})
export const getAllUserWordsListProgresses = cache(async (classId: string, wordListId: string) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: {
      classId: classId,
      wordsListListId: wordListId,
    },
    include: { 
      quizzes: true,
      user: true,
    }
  });
  return data;
})
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
  },
);
export const getUserWordLists = cache(async (userID: string) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: { userId: userID },
    include: { wordsList: true },
    orderBy: { dueDate: "desc" },
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

export const getClassWordLists = cache(async ( classID: string) => {
  const currClass = await prisma.class.findFirst({
    where: {
      classId: classID,
    },
    select:{
      students: true,
    }
  });
  if(!currClass){
    throw new Error("Class not found");
  }
  if(currClass.students.length === 0){
    return [];
  }
  const studentId = currClass.students[0].id;
  const data = await prisma.userWordsListProgress.findMany({
    where: { userId: studentId, classId: classID },
    include: { wordsList: true },
    orderBy: { dueDate: 'desc' }
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

export const getUserWordListProgressWithList = cache(
  async (userID: string, wordListID: string) => {
    const data = await prisma.userWordsListProgress.findFirst({
      where: { userId: userID, wordsListListId: wordListID },
      include: { wordsList: true },
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
      userWordsListProgress: true,
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
    //TODO: Add a completed at field to quizzes
    orderBy:{
      completedAt: 'desc'
    }
  });
  return quizzes;
});

export const getLearnQuiz = cache(async (quizID: string) => {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    select: {
      questions:{
        select:{
          word: true
        }
      },
      userWordsListProgress:{
        select:{
          classId: true,
          wordsListListId: true,
        }
      }
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return { words: quiz.questions.map((question) => question.word), classId: quiz.userWordsListProgress.classId, wordListId: quiz.userWordsListProgress.wordsListListId };
});
