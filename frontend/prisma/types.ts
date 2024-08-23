import { Prisma } from "@prisma/client";

export type QuizWithQuestionsAndUserWordsList = Prisma.QuizGetPayload<{
  include: {
    questions: true;
    userWordsListProgress: true;
  };
}>;

export type WordsListWithWordsAndUserWordsList = Prisma.WordsListGetPayload<{
  include: {
    words: true;
    UserWordsListProgress: true;
  };
}>;

export type UserWordsListProgressWithWordsList =
  Prisma.UserWordsListProgressGetPayload<{
    include: {
      wordsList: true;
    };
  }>;
