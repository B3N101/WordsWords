"use server";
import { auth } from "@/auth/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertWordMastery = async (wordId: string, isCorrect: boolean, wordListId: string) => {
  console.log("Upserding word mastery");
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const currWordMastery = await prisma.userWordMastery.findFirst({
    where: {
      wordId: wordId,
      userId: userId,
    },
    include:{
      attempts: true,
    }
  });
  let masteryScore;
  if (!currWordMastery || currWordMastery.attempts.length === 0) {
    if (isCorrect) {
      masteryScore = 0.75;
    } else {
      masteryScore = 0.25;
    }
  } else {
    if (isCorrect) {
      masteryScore = Math.min(1, currWordMastery.masteryScore + 0.25);
    } else {
      masteryScore = Math.max(0.25, currWordMastery.masteryScore - 0.25);
    }
  }
  await prisma.userWordMastery.upsert(
    {
      where: {
        userId: userId,
        wordId: wordId,
      },
      update: {
        masteryScore: masteryScore,
        attempts: {
          create: {
            userId: userId,
            correct: isCorrect,
          },
        },
      },
      create: {
        wordId: wordId,
        userId: userId,
        masteryScore: masteryScore,
        wordsListId: wordListId,
        attempts: {
          create: {
            userId: userId,
            correct: isCorrect,
          },
        },
      },
    },
  );
  return;
};
