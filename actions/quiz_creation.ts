"use server";
import { QuizType, Question } from "@prisma/client";
import prisma from "@/prisma/prisma";

function pickNRandom(arr: string[], n: number) {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) {
    throw new RangeError("getRandom: more elements taken than available");
  }
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export const createMiniQuiz = async (
  wordListId: string,
  userId: string,
  classId: string,
  miniSetId: number,
  learnCompleted: boolean,
) => {
  const wordList = await prisma.wordsList.findFirst({
    where: {
      listId: wordListId,
    },
    include: {
      words: true,
    },
  });
  if (!wordList) {
    throw new Error("Word list not found");
  }
  // get the words associated with the correct miniquiz
  const allwords = wordList.words;
  let words;
  if (miniSetId === 2) {
    words = allwords.slice(miniSetId * 5);
  } else {
    words = allwords.slice(miniSetId * 5, (miniSetId + 1) * 5);
  }
  console.log("Words are", words);
  if (words.length === 0) {
    return null;
  }
  // shuffle the words
  const shuffledWords = words.sort(() => Math.random() - 0.5);
  const questions = shuffledWords.map((word, index) => {
    // get random number between 0 and 1
    const random = Math.random();

    // first type of question
    if (random < 0.5) {
      // Take two of the incorrect definitions at random
      const answerChoices = pickNRandom(word.incorrectDefinitions, 3);
      // add the correct definition
      answerChoices.push(word.definition);
      return {
        questionString: "What is the definition of " + word.word + "?",
        rank: index,
        allAnswers: answerChoices,
        correctAnswer: word.definition,
        wordId: word.wordId,
      };
    }
    // second type of question
    else {
      const answerChoices = word.incorrectFillIns;
      answerChoices.push(word.correctFillIn);
      return {
        questionString: word.exampleSentence,
        rank: index,
        allAnswers: answerChoices,
        correctAnswer: word.correctFillIn,
        wordId: word.wordId,
      };
    }
  });

  const quiz = await prisma.quiz.create({
    data: {
      user: { connect: { id: userId } },
      wordsList: { connect: { listId: wordListId } },
      quizType: QuizType.MINI,
      class: { connect: { classId: classId } },
      name: "Mini Quiz " + (miniSetId + 1),
      length: questions.length,
      miniSetNumber: miniSetId,
      learnCompleted: learnCompleted,
      userWordsListProgress: {
        connectOrCreate: {
          create: {
            user: { connect: { id: userId } },
            wordsList: { connect: { listId: wordListId } },
            class: { connect: { classId: classId } },
          },
          where: {
            userWordsListProgressId: {
              userId: userId,
              wordsListListId: wordListId,
              classId: classId,
            },
          },
        },
      },
      questions: {
        createMany: {
          data: questions,
        },
      },
    },
  });
  return quiz;
};

export const createMasterQuiz = async (
  wordListId: string,
  userId: string,
  classId: string,
) => {
  const classWordsList = await prisma.classWordsList.findFirst({
    where:{
      listId: wordListId,
      classId: classId,
    },
    include:{
      wordsList: {
        include: {
          words: true,
        }
      },
    }
  })
  if (!classWordsList){
    throw new Error("Word list not found");
  }
  const wordList = classWordsList.wordsList;
  const words = wordList.words;
  // retrieve the 5 words with the lowest mastery score from other lists
  const lastThreeLists = await prisma.classWordsList.findMany({
    where: {
      classId: classId,
      dueDate: {
        lt: classWordsList.dueDate,
      },
      listId:{
        not: wordListId,
      },
    },
    orderBy: {
      dueDate: "desc",
    },
    select:{
      listId: true,
    },
    take: 3,
  });
  const lastThreeListIds = lastThreeLists.map(list => list.listId);
  console.log("Taking from last three lists", lastThreeListIds)
  const oldWords = await prisma.userWordMastery.findMany({
    where: {
      userId: userId,
      classId: classId,
      word: {
        listId: {
          in: lastThreeListIds,
        },
      },
      masteryScore: {
        gt: 0,
      },
    },
    orderBy: {
      masteryScore: "asc",
    },
    select: {
      word: true,
    },
    take: 5,
  });
  console.log("Old words are ", oldWords);
  const allWords = words.concat(oldWords.flatMap((word) => word.word));
  const allShuffledWords = allWords.sort(() => Math.random() - 0.5);
  const questions = allShuffledWords.map((word, index) => {
    // get random number between 0 and 1
    const random = Math.random();

    // first type of question
    if (random < 0.5) {
      // Take two of the incorrect definitions at random
      const answerChoices = pickNRandom(word.incorrectDefinitions, 3);
      // add the correct definition
      answerChoices.push(word.definition);
      return {
        questionString: "What is the definition of " + word.word + "?",
        rank: index,
        allAnswers: answerChoices,
        correctAnswer: word.definition,
        wordId: word.wordId,
      };
    }
    // second type of question
    else {
      const answerChoices = word.incorrectFillIns;
      answerChoices.push(word.correctFillIn);
      return {
        questionString: word.exampleSentence,
        rank: index,
        allAnswers: answerChoices,
        correctAnswer: word.correctFillIn,
        wordId: word.wordId,
      };
    }
  });
  const quiz = await prisma.quiz.create({
    data: {
      user: { connect: { id: userId } },
      wordsList: { connect: { listId: wordListId } },
      name: "Master Quiz",
      quizType: QuizType.MASTERY,
      length: questions.length,
      miniSetNumber: -1,
      learnCompleted: true,
      class: { connect: { classId: classId } },
      userWordsListProgress: {
        connectOrCreate: {
          create: {
            user: { connect: { id: userId } },
            wordsList: { connect: { listId: wordListId } },
            class: { connect: { classId: classId } },
          },
          where: {
            userWordsListProgressId: {
              userId: userId,
              wordsListListId: wordListId,
              classId: classId,
            },
          },
        },
      },
      questions: {
        createMany: {
          data: questions,
        },
      },
    },
  });
  return quiz;
};
export const fetchBackupMiniQuiz = async (
  wordListId: string,
  userId: string,
  miniSetId: number,
) => {
  const backupQuiz = await prisma.quiz.findFirst({
    where: {
      wordsListId: wordListId,
      userId: userId,
      quizType: QuizType.MINI,
      miniSetNumber: miniSetId,
      completed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return backupQuiz;
};
export const fetchBackupMasterQuiz = async (
  wordListId: string,
  userId: string,
) => {
  const backupQuiz = await prisma.quiz.findFirst({
    where: {
      wordsListId: wordListId,
      userId: userId,
      quizType: QuizType.MASTERY,
      completed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return backupQuiz;
};
// Fetchquizzes used in every wordlist page to get the active quiz
export const fetchQuizzes = async (
  wordListId: string,
  userId: string,
  classId: string,
) => {
  let miniQuizzes = [];

  for (let miniSetNumber = 0; miniSetNumber < 3; miniSetNumber++) {
    // First look for a completed quiz, then an uncompleted quiz.
    let latestQuiz = await prisma.quiz.findFirst({
      where: {
        wordsListId: wordListId,
        userId: userId,
        quizType: QuizType.MINI,
        miniSetNumber: miniSetNumber,
        classId: classId,
        completed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestQuiz) {
      latestQuiz = await prisma.quiz.findFirst({
        where: {
          wordsListId: wordListId,
          userId: userId,
          classId: classId,
          quizType: QuizType.MINI,
          miniSetNumber: miniSetNumber,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!latestQuiz) {
        console.log("No latest quiz found for miniset", miniSetNumber);
        latestQuiz = await createMiniQuiz(
          wordListId,
          userId,
          classId,
          miniSetNumber,
          false,
        );
      }
    }

    if (latestQuiz) {
      console.log("Found latest quiz");
      miniQuizzes.push(latestQuiz);
    }
  }

  // check if all the miniquizzes are completed. If not, no master quiz
  for (let miniquiz of miniQuizzes) {
    if (!miniquiz.completed) {
      return { miniQuizzes, masterQuiz: null };
    }
  }
  // otherwise a masterquiz is either available or needs to be created
  let masterQuiz = await prisma.quiz.findFirst({
    where: {
      wordsListId: wordListId,
      classId: classId,
      userId: userId,
      quizType: QuizType.MASTERY,
      completed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!masterQuiz) {
    masterQuiz = await prisma.quiz.findFirst({
      where: {
        wordsListId: wordListId,
        classId: classId,
        userId: userId,
        quizType: QuizType.MASTERY,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!masterQuiz) {
      masterQuiz = await createMasterQuiz(wordListId, userId, classId);
    }
  }
  return { miniQuizzes, masterQuiz };
};
