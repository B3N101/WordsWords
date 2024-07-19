import { Prisma } from "@prisma/client";

export type QuestionWithAnswerOptions = Prisma.QuestionGetPayload<{
  include: { answers: true };
}>;
export type UserQuizWithID = Prisma.UserQuizProgressGetPayload<{
  select: { quizQuizId: true; learnCompleted: true };
}>;
export type QuizWithQuestions = Prisma.QuizGetPayload<{
  include: {
    questions: {
      include: {
        answers: true;
      };
      orderBy: {
        questionId: "asc";
      };
    };
  };
}>;
export type Answer = Prisma.AnswerGetPayload<{}>;

export type UserQuizProgressWithQuiz = Prisma.UserQuizProgressGetPayload<{
  include: {
    quiz: {
      include: {
        questions: {
          include: {
            answers: true;
            userQuestionProgress: true;
          };
          orderBy: {
            questionId: "asc";
          };
        };
      };
    };
  };
}>;
