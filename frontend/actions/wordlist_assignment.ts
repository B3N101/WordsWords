"use server";
import { auth } from "@/auth/auth";
import { QuizType } from "@prisma/client";
import prisma from "@/prisma/prisma";

export const updateUserListDueDate = async (
  userId: string,
  wordsListId: string,
  dueDate: Date,
) => {
  console.log("Changing date to ", dueDate);
  console.log(
    "Time is ",
    dueDate.toUTCString(),
    "string is ",
    dueDate.toString(),
  );
  await prisma.userWordsListProgress.update({
    where: {
      userWordsListProgressId: {
        userId: userId,
        wordsListListId: wordsListId,
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
  });
  if (!wordsList) {
    throw new Error("Words list not found");
  }
  console.log("Creating user words list for class");

  for (const student of currClass.students) {
    await prisma.userWordsListProgress.upsert({
      where: {
        userWordsListProgressId: {
          userId: student.id,
          wordsListListId: wordsListId,
        },
      },
      update: {
        dueDate: dueDate,
        wordsList: { connect: { listId: wordsListId } },
        class: { connect: { classId: classId } },
      },
      create: {
        user: { connect: { id: student.id } },
        wordsList: { connect: { listId: wordsListId } },
        class: { connect: { classId: classId } },
        dueDate: dueDate,
      },
    });
  }
};


export async function connectClassActiveWordLists ( userID: string, classID: string) {
  const currClass = await prisma.class.findFirst({
    where: {
      classId: classID,
    },
    select:{
      students: true,
      teacherId: true,
    }
  });
  if(!currClass){
    throw new Error("Class not found");
  }
  if(currClass.students.length === 0){
    return [];
  }
  const activeLists = await prisma.userWordsListProgress.findMany({
    where: { 
      userId: currClass.students[0].id, 
      classId: classID,
      dueDate:{
        gte: new Date()
      }
    },
    select: {
      wordsListListId: true,
      dueDate: true,
     },
    orderBy: { dueDate: 'desc' }
  });
  for (const list of activeLists){
    await prisma.userWordsListProgress.upsert({
      where: {
        userWordsListProgressId: {
          userId: userID,
          wordsListListId: list.wordsListListId,
        },
      },
      create: {
        userId: userID,
        wordsListListId: list.wordsListListId,
        classId: classID,
        dueDate: list.dueDate,
      },
      update: {
        dueDate: list.dueDate,
        wordsList: { connect: { listId: list.wordsListListId } },
        class: { connect: { classId: classID } },
      },
    });
  }
};