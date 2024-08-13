import { Prisma } from "@prisma/client";

export type QuizWithQuestionsAndUserWordsList = Prisma.QuizGetPayload<{
    include: {
      questions: true,
      userWordsListProgress: true,
    };
  }>;