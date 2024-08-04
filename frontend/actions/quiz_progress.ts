"use server";
import { auth } from "@/auth/auth";
import { PrismaClient } from "@prisma/client";
// import { getUserQuizProgress } from "@/prisma/queries";
const prisma = new PrismaClient();
export const upsertLearnCompleted = async (
  quizId: string,
  completed: boolean,
) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const userQuiz = await prisma.userQuizProgress.findFirst({
    where: {
      quizQuizId: quizId,
      userId: userId,
    },
  });
  if (!userQuiz) {
    throw new Error("Quiz not found");
  }
  await prisma.userQuizProgress.update({
    where: {
      userQuizProgressId: userQuiz.userQuizProgressId,
      userId: userId,
    },
    data: {
      learnCompleted: completed,
    },
  });
  return;
};
export const upsertQuestionCompleted = async (
  userQuestionId: string,
  completed: boolean,
) => {
  const session = await auth();
  const userId = session?.user?.id;
  console.log();
  const quizQuestion = await prisma.userQuestionProgress.findFirst({
    where: {
      userQuestionProgressId: userQuestionId,
      userId: userId,
    },
  });
  if (!quizQuestion) {
    throw new Error("Question not found");
  }
  // if (quizQuestion.completed === completed) {
  //   throw new Error("Trying to update question with the same completed value");
  // }
  await prisma.userQuestionProgress.update({
    where: {
      userQuestionProgressId: userQuestionId,
      userId: userId,
    },
    data: {
      completed: completed,
    },
  });
  return;
};

export const upsertQuizCompleted = async (
  userQuizId: string,
  completed: boolean,
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const userQuiz = await prisma.userQuizProgress.findFirst({
    where: {
      userQuizProgressId: userQuizId,
      userId: userId,
    },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              answers: true,
              userQuestionProgress: {
                where: {
                  userId: userId,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userQuiz) {
    throw new Error("Quiz not found");
  }
  // if (userQuiz.completed === completed) {
  //   throw new Error("Trying to update quiz with the same completed value");
  // }

  // reset all userQuestionProgress to the same as the quiz
  const questions = userQuiz.quiz.questions;
  const userQuestions = questions
    .map((question) => question.userQuestionProgress)
    .flat(); // flatten from a [[],[],[]] to [, , ,]

  for (const userQuestion of userQuestions) {
    await prisma.userQuestionProgress.update({
      where: {
        userQuestionProgressId: userQuestion.userQuestionProgressId,
        userId: userId,
      },
      data: {
        completed: completed,
      },
    });
  }
  // TODO: update quiz random seed

  await prisma.userQuizProgress.update({
    where: {
      userQuizProgressId: userQuizId,
      userId: userId,
    },
    data: {
      completed: completed,
    },
  });
  return;
};
