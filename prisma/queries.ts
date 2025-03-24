import { cache } from "react";
import { UserWordsListProgress } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";
import prisma from "./prisma";

export const getStudySession = async (userId: string, classId: string) => {
  const data = await prisma.studySpace.findFirst({
    where: {
      userID: userId,
      classID: classId,
    },
    include: {
      wordLists: true,
      StudySpaceWords: {
        include: {
          word: true,
        },
      },
      StudySpaceQuizzes: true,
    },
  });
  return data;
};
export const getAllCompletedWordsLists = async (
  userId: string,
  classId: string,
) => {
  const data = await prisma.userWordsListProgress.findMany({
    where: {
      userId: userId,
      classId: classId,
      completed: true,
    },
    include: {
      wordsList: {
        include: {
          words: true,
        },
      },
    },
  });

  return data;
};
export const getListSize = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: {
      listId: wordListID,
    },
    select: {
      words: true,
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
    select: {
      role: true,
    },
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
      ClassWordsList: {
        some: {
          classId: classId,
        },
      },
    },
    include: {
      words: true,
      UserWordsListProgress: true,
    },
    orderBy: {
      listNumber: "asc",
    },
  });
  return data;
});

export const getAllWordListsNotAssigned = cache(async (classId: string) => {
  const data = await prisma.wordsList.findMany({
    where: {
      ClassWordsList: {
        none: {
          classId: classId,
        },
      },
    },
    include: {
      words: true,
      UserWordsListProgress: true,
    },
    orderBy: {
      listNumber: "asc",
    },
  });
  return data;
});

export const getWordListName = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    select: { name: true },
  });
  return data;
});
export const getListNameAndDueDate = cache(
  async (classId: string, wordListID: string) => {
    const classWordsList = await prisma.classWordsList.findFirst({
      where: {
        classId: classId,
        listId: wordListID,
      },
      include: {
        wordsList: true,
      },
    });
    return {
      name: classWordsList?.wordsList.name,
      dueDate: classWordsList?.dueDate,
    };
  },
);
export const getAllUserWordsListProgresses = cache(
  async (classId: string, wordListId: string) => {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        Classes: {
          some: {
            classId: classId,
          },
        },
      },
    });
    const data = await prisma.userWordsListProgress.findMany({
      where: {
        userId: {
          in: students.map((student) => student.id),
        },
        wordsListListId: wordListId,
        classId: classId,
      },
      include: {
        quizzes: true,
        user: true,
      },
    });
    return data;
  },
);
export const getUserWordListsWithMasteries = cache(
  async (userID: string, classID: string) => {
    const data = await prisma.userWordsListProgress.findMany({
      where: {
        userId: userID,
        classId: classID,
      },
      include: {
        userWordMasteries: {
          orderBy: { masteryScore: "desc" },
          include: { word: true },
        },
        wordsList: true,
      },
    });
    return data;
  },
);

export const getUserClassWordLists = cache(
  async (userID: string, classID: string) => {
    const data = await prisma.userWordsListProgress.findMany({
      where: {
        userId: userID,
        classId: classID,
      },
      include: { wordsList: true },
    });
    return data;
  },
);

export const getClassWordLists = cache(async (classID: string) => {
  const listData = await prisma.classWordsList.findMany({
    where: {
      classId: classID,
    },
    include: {
      wordsList: true,
    },
    orderBy: {
      dueDate: "desc",
    },
  });
  return listData;
});

export const getWordList = cache(async (wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
    where: { listId: wordListID },
    include: { words: true },
  });

  return data;
});

export const getUserWordListProgressWithList = cache(
  async (userID: string, wordListID: string, classID: string) => {
    const data = await prisma.userWordsListProgress.findFirst({
      where: { userId: userID, wordsListListId: wordListID, classId: classID },
      include: { wordsList: true },
    });
    return data;
  },
);


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

export const getQuizzesFromWordsList = cache(
  async (wordListID: string, userId: string, classId: string) => {
    const quizzes = await prisma.quiz.findMany({
      where: {
        wordsListId: wordListID,
        userId: userId,
        classId: classId,
        completed: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });
    return quizzes;
  },
);

export const getLearnQuiz = cache(async (quizID: string) => {
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizID,
    },
    select: {
      questions: {
        select: {
          word: true,
        },
      },
      userWordsListProgress: {
        select: {
          classId: true,
          wordsListListId: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }
  return {
    words: quiz.questions.map((question) => question.word),
    classId: quiz.userWordsListProgress.classId,
    wordListId: quiz.userWordsListProgress.wordsListListId,
  };
});
