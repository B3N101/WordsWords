"use server";
import { auth } from "@/auth/auth";
import { UserWordsListProgress } from "@prisma/client";
import prisma from "@/prisma/prisma";

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
  correct: boolean,
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
      correctlyAnswered: correct,
    },
  });
  return;
};

export const upsertQuizCompleted = async (
  quizId: string,
  completed: boolean,
  score: number,
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
      score: score,
      completedAt: new Date(),
    },
  });
  const miniSetId = quiz.quizType == "MINI" ? quiz.miniSetNumber : 3;
  await upsertQuizAttempts(userId, quiz.wordsListId, quiz.classId!, miniSetId, -1);
  return;
};

export const upsertQuizAttempts = async (
  userId: string,
  wordListId: string,
  classId: string,
  miniSetId: number,
  addAttempts: number,
) => {
  // TODO: change this to adding classID once database has been updated
  const wordsListProgress = await prisma.userWordsListProgress.findFirst({
    where: {
      userId: userId,
      wordsListListId: wordListId,
      classId: classId,
    },
    select: {
      quizAttemptsRemaining: true,
      retakesRequested: true,
    },
  });
  if (!wordsListProgress) {
    throw new Error("User Wordslist progress not found!");
  }

  const newAttempts = wordsListProgress.quizAttemptsRemaining;
  newAttempts[miniSetId] += addAttempts;

  const newRetakes = wordsListProgress.retakesRequested;
  newRetakes[miniSetId] = false;

  // TODO: change this to adding classID once database has been updated
  await prisma.userWordsListProgress.update({
    where: {
      userWordsListProgressId: {
        userId: userId,
        wordsListListId: wordListId,
        classId: classId,
      },
    },
    data: {
      quizAttemptsRemaining: newAttempts,
      retakesRequested: newRetakes,
    },
  });
};

export const upsertRetakesRequested = async (
  userId: string,
  wordListId: string,
  classId: string,
  miniSetId: number,
  requested: boolean,
) => {

  // TODO: change this to adding classID once database has been updated
  const wordsListProgress = await prisma.userWordsListProgress.findFirst({
    where: {
      userId: userId,
      wordsListListId: wordListId,
      classId: classId,
    },
    select: {
      retakesRequested: true,
    },
  });
  if (!wordsListProgress) {
    throw new Error("User Wordslist progress not found!");
  }

  const newRetakes = wordsListProgress.retakesRequested;
  newRetakes[miniSetId] = requested;
  // TODO: change this to adding classID once database has been updated
  await prisma.userWordsListProgress.update({
    where: {
      userWordsListProgressId: {
        userId: userId,
        wordsListListId: wordListId,
        classId: classId,
      },
    },
    data: {
      retakesRequested: newRetakes,
    },
  });
};

export const upsertRetakesGranted = async (
  wordsListProgress: UserWordsListProgress,
  changedRetakes: number[],
) => {
  const newAttempts = wordsListProgress.quizAttemptsRemaining;
  const newRetakesRequested = wordsListProgress.retakesRequested;
  for (let i = 0; i < changedRetakes.length; i++) {
    newAttempts[i] += changedRetakes[i];
    if (newAttempts[i] < 0) {
      newAttempts[i] = 0;
    }

    if (changedRetakes[i] > 0) {
      newRetakesRequested[i] = false;
    }
  }

  await prisma.userWordsListProgress.update({
    // TODO: change this to adding classID once database has been updated
    where: {
      userWordsListProgressId: {
        userId: wordsListProgress.userId,
        wordsListListId: wordsListProgress.wordsListListId,
        classId: wordsListProgress.classId,
      },
    },
    data: {
      quizAttemptsRemaining: newAttempts,
      retakesRequested: newRetakesRequested,
    },
  });
};
