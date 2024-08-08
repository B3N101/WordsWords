"use server";
import { auth } from "@/auth/auth";
import { PrismaClient } from "@prisma/client";
// import { getUserQuizProgress } from "@/prisma/queries";
const prisma = new PrismaClient();
export const upsertLearnCompleted = async (
  quizId: string,
  completed: boolean,
) => {
  await prisma.quiz.update({
    where: {
      quizId: quizId,
    },
    data: {
      learnCompleted: completed,
    },
  });
  return;
};
export const upsertQuestionCompleted = async (
  questionId: string,
  completed: boolean,
) => {
  // if (quizQuestion.completed === completed) {
  //   throw new Error("Trying to update question with the same completed value");
  // }
  await prisma.question.update({
    where: {
      questionId: questionId,
    },
    data: {
      completed: completed,
    },
  });
  return;
};

export const upsertQuizCompleted = async (
  quizId: string,
  completed: boolean,
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }
  const quiz = await prisma.quiz.findFirst({
    where: {
      quizId: quizId,
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }
  // if (userQuiz.completed === completed) {
  //   throw new Error("Trying to update quiz with the same completed value");
  // }

  // reset all questions progress to the same as the quiz
  await prisma.question.updateMany({
    where: {
      quizId: quizId,
    },
    data: {
      completed: completed,
    },
  });
  await prisma.quiz.update({
    where: {
      quizId: quizId,
    },
    data: {
      completed: completed,
    },
  });
  return;
};
