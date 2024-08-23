"use server";
import { auth } from "@/auth/auth";
import { PrismaClient, QuizType } from "@prisma/client";

const prisma = new PrismaClient();
export const updateWordListProgress = async (wordListId: string, userId: string, completed: boolean) =>{
  await prisma.userWordsListProgress.update({
    where:{
      userWordsListProgressId:{
        userId: userId,
        wordsListListId: wordListId,
      }
    },
    data:{
      completed: completed,
    }
  });
}
export const upsertWordMastery = async (
  wordId: string,
  isCorrect: boolean,
  wordListId: string,
  quizType: QuizType,
) => {
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
    include: {
      attempts: true,
    },
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
  await prisma.userWordMastery.upsert({
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
  });
  return;
};
