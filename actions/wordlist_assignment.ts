"use server";
import { auth } from "@/auth/auth";
import { QuizType } from "@prisma/client";
import prisma from "@/prisma/prisma";

export const updateUserListDueDate = async (
  userId: string,
  wordsListId: string,
  classId: string,
  dueDate: Date,
) => {
  console.log("Changing date to ", dueDate);
  console.log(
    "Time is ",
    dueDate.toUTCString(),
    "string is ",
    dueDate.toString(),
  );
  //TODO: change this to adding classID once database has been updated
  await prisma.userWordsListProgress.update({
    where: {
      userWordsListProgressId: {
        userId: userId,
        wordsListListId: wordsListId,
        classId: classId
      },
    },
    data: {
      dueDate: dueDate,
    },
  });
};
export const deleteUserWordsListForClass = async (
  wordsListId: string,
  classId: string,
) => {
  console.log("Deleting user words list for class");
  const deleteWordsList = await prisma.userWordsListProgress.deleteMany({
    where: {
      wordsListListId: wordsListId,
      classId: classId,
    },
  });
};

export const createUserWordsListForClass = async (
  userId: string,
  wordsListId: string,
  classId: string,
  dueDate: Date,
) => {
  console.log("Fetching class");
  const currClass = await prisma.class.findFirst({
    where: {
      classId: classId,
    },
    include: {
      students: true,
    },
  });
  console.log("Class found");
  if (!currClass) {
    throw new Error("Class not found");
  }
  if (currClass.teacherId !== userId) {
    throw new Error("User not authorized to create words list");
  }
  const wordsList = await prisma.wordsList.findFirst({
    where: {
      listId: wordsListId,
    },
    include: {
      words: true,
    },
  });
  if (!wordsList) {
    throw new Error("Words list not found");
  }
  console.log("Creating user words list for class");

  for (const student of currClass.students) {
    //TODO: change this to adding classID once database has been updated
    await prisma.userWordsListProgress.upsert({
      where: {
        userWordsListProgressId: {
          userId: student.id,
          wordsListListId: wordsListId,
          classId: classId,
        },
      },
      update: {
        dueDate: dueDate,
        wordsList: { connect: { listId: wordsListId } },
        class: { connect: { classId: classId } },
        userWordMasteries: {
          upsert: wordsList.words.map((word) => {
            return {
              where: {
                userWordMasteryId: {
                  userId: student.id,
                  wordId: word.wordId,
                  classId: classId,
                },
              },
              create: {
                word: { connect: { wordId: word.wordId } },
                user: { connect: { id: student.id } },
                class: { connect: { classId: classId } },
                masteryScore: 0,
              },
              update: {},
            };
          }),
        },
      },
      create: {
        user: { connect: { id: student.id } },
        wordsList: { connect: { listId: wordsListId } },
        class: { connect: { classId: classId } },
        userWordMasteries: {
          create: wordsList.words.map((word) => {
            return {
              word: { connect: { wordId: word.wordId } },
              user: { connect: { id: student.id } },
              class: { connect: { classId: classId } },
              masteryScore: 0,
            };
          }),
        },
        dueDate: dueDate,
      },
    });
  }
};
export const deleteClassWordsList = async (
  wordsListId: string,
  classId: string,
) => {
  console.log("Deleting class wordslist");
  const deleteWordsList = await prisma.classWordsList.delete({
    where: {
      classWordsListId: {
        listId: wordsListId,
        classId: classId,
      },
    },
  });
};
export const createClassWordsList = async (
  userId: string,
  wordsListId: string,
  classId: string,
  dueDate: Date,
) => {
  console.log("Fetching class");
  const currClass = await prisma.class.findFirst({
    where: {
      classId: classId,
    },
    include: {
      students: true,
    },
  });
  console.log("Class found");
  if (!currClass) {
    throw new Error("Class not found");
  }
  if (currClass.teacherId !== userId) {
    throw new Error("User not authorized to create words list");
  }
  const wordsList = await prisma.wordsList.findFirst({
    where: {
      listId: wordsListId,
    },
    include: {
      words: true,
    },
  });
  if (!wordsList) {
    throw new Error("Words list not found");
  }
  console.log("Creating class words list for class");
  await prisma.classWordsList.upsert({
    where: {
      classWordsListId: {
        listId: wordsListId,
        classId: classId,
      },
    },
    create: {
      wordsList: { connect: { listId: wordsListId } },
      class: { connect: { classId: classId } },
      dueDate: dueDate,
    },
    update: {
      dueDate: dueDate,
    },
  });
};

export async function connectClassActiveWordLists(
  userID: string,
  classID: string,
) {
  const currClass = await prisma.class.findFirst({
    where: {
      classId: classID,
    },
    select: {
      students: true,
      teacherId: true,
    },
  });
  if (!currClass) {
    throw new Error("Class not found");
  }
  if (currClass.students.length === 0) {
    return [];
  }
  const todayMinusOne = new Date();
  todayMinusOne.setDate(todayMinusOne.getDate() - 1);
  const activeLists = await prisma.classWordsList.findMany({
    where: {
      classId: classID,
      dueDate: {
        gte: todayMinusOne,
      },
    },
    select: {
      listId: true,
      dueDate: true,
    },
    orderBy: { dueDate: "desc" },
  });

  for (const list of activeLists) {
    // TODO: change this to adding classID once database has been updated
    await prisma.userWordsListProgress.upsert({
      where: {
        userWordsListProgressId: {
          userId: userID,
          wordsListListId: list.listId,
          classId: classID,
        },
      },
      create: {
        userId: userID,
        wordsListListId: list.listId,
        classId: classID,
        dueDate: list.dueDate,
      },
      update: {
        dueDate: list.dueDate,
        wordsList: { connect: { listId: list.listId } },
      },
    });
  }
}
