"use server";
import { auth } from "@/auth/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertWordMastery = async (wordId: string, isCorrect: boolean) => {
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
  });
  let masteryScore;
  if (!currWordMastery) {
    if (isCorrect) {
      masteryScore = 0.75;
    } else {
      masteryScore = 0.25;
    }
  } else {
    if (isCorrect) {
      masteryScore = Math.min(1, currWordMastery.masteryScore + 0.25);
    } else {
      masteryScore = Math.max(0, currWordMastery.masteryScore - 0.25);
    }
  }
  await prisma.userWordMastery.create({
    data: {
      wordId: wordId,
      userId: userId,
      attempts: {
        create: {
          userId: userId,
          correct: isCorrect,
        },
      },
      masteryScore: masteryScore,
    },
  });
  return;
};
