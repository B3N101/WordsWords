"use server";
import { auth } from "@/auth/auth";
import { QuizType } from "@prisma/client";
import prisma from "@/prisma/prisma";

export const updateWordListProgress = async (
  wordListId: string,
  userId: string,
  classId: string,
  completed: boolean,
) => {
  await prisma.userWordsListProgress.update({
    // TODO: change this to adding classID once database has been updated
    where: {
      userWordsListProgressId: {
        userId: userId,
        wordsListListId: wordListId,
        classId: classId,
      },
    },
    data: {
      completed: completed,
    },
  });
};
export const upsertWordMastery = async (
  wordId: string,
  isCorrect: boolean,
  wordListId: string,
  classId: string,
  quizType: QuizType,
) => {
  console.log("Upserding word mastery");
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const currWordMastery = await prisma.userWordMastery.findFirst({
    // TODO: change this to adding classID once database has been updated
    where: {
      wordId: wordId,
      userId: userId,
      classId: classId,
    },
  });
  let masteryScore;
  if (!currWordMastery || currWordMastery.masteryScore === 0) {
    if (isCorrect) {
      masteryScore = 0.75;
    } else {
      masteryScore = 0.25;
    }
  } else {
    if (isCorrect) {
      // only allow mastery to be achieved on mastery quizzes
      if (quizType === QuizType.MASTERY || currWordMastery.masteryScore === 1) {
        masteryScore = Math.min(1, currWordMastery.masteryScore + 0.25);
      } else {
        masteryScore = Math.min(0.75, currWordMastery.masteryScore + 0.25);
      }
    } else {
      masteryScore = Math.max(0.25, currWordMastery.masteryScore - 0.25);
    }
  }
  // TODO: change this to adding classID once database has been updated
  await prisma.userWordMastery.upsert({
    where: {
      userWordMasteryId: {
        userId: userId,
        wordId: wordId,
        classId: classId,
      },
    },
    update: {
      masteryScore: masteryScore,
    },
    create: {
      wordId: wordId,
      userId: userId,
      classId: classId,
      masteryScore: masteryScore,
      wordsListId: wordListId,
    },
  });
  return;
};
