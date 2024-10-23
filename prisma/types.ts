import { Prisma } from "@prisma/client";

export type StudySpaceWordWithWord = Prisma.StudySpaceWordGetPayload<{
  include: {
    word: true;
  };
}>;
export type StudySpaceWithLists = Prisma.StudySpaceGetPayload<{
  include: {
    wordLists: true;
    StudySpaceWords: {
      include: {
        word: true;
      };
    };
    StudySpaceQuizzes: true;  
  };
}>;
export type StudyQuizWithQuestions = Prisma.StudySpaceQuizGetPayload<{
  include: {
    questions: {
      include:{
        studyWord: {
          include:{
            word: true;
          },
        },
      }
    };
  };
}>;
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

export type ClassWordsListWithWordsList = Prisma.ClassWordsListGetPayload<{
  include: {
    wordsList: true;
  };
}>;
