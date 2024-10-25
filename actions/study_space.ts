"use server";

import prisma from "@/prisma/prisma";
import { StudySpaceWordWithWord } from "@/prisma/types";


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

export const deleteStudySpace = async (studySpaceId: string) => {
    await prisma.studySpace.delete({
        where: {
            id: studySpaceId,
        },
    });
    return;
}
export const createNewStudySpace = async (
    userId: string,
    classId: string,
    wordListIds: string[],
) => {
    const studySpaceExisting = await prisma.studySpace.findFirst({
        where: {
            userID: userId,
            classID: classId,
        },
    });
    if (studySpaceExisting) {
        await prisma.studySpace.delete({
            where:{
                userID_classID:{
                    userID: userId,
                    classID: classId,
                },
            },
        });
    }
    const wordLists = await prisma.wordsList.findMany({
        where: {
            listId: {
                in: wordListIds,
            },
        },
        include:{
            words: true,
        }
    });
    const studySpace = await prisma.studySpace.create({
        data: {
            userID: userId,
            classID: classId,
            wordLists: {
                connect: wordListIds.map((id) => ({ listId: id })),
            },
            StudySpaceWords:{
                create: wordLists.flatMap((wordList) => {
                    return wordList.words.map((word) => {
                        return {
                            word: {
                                connect: {
                                    wordId: word.wordId,
                                },
                            },
                            starred: false,
                        };
                    });
                }),
            },
            
        },
    });
    return studySpace;
}
export const createFlashCardQuiz = async (
    studySpaceID: string,
    studyWords: StudySpaceWordWithWord[],
) => {
    try{
        await prisma.studySpaceQuiz.deleteMany({
            where:{
                studySpaceID: studySpaceID,
                studyType: "FLASHCARD",
            },
        })
    }
    catch(e){
        console.log("No previous flashcard quiz found");
    }
    // shuffle the words
    const shuffledWords = studyWords.sort(() => Math.random() - 0.5);
    const questions = shuffledWords.map((studyWord, index) => {
      const word = studyWord.word;
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
          wordID: word.wordId,
          studySpaceID: studySpaceID,
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
          wordID: word.wordId,
          studySpaceID: studySpaceID,
        };
      }
    });
    const studyQuiz = await prisma.studySpaceQuiz.create({
        data: {
            studySpace: { connect: { id: studySpaceID } },
            length: questions.length,
            studyType: "FLASHCARD",
            questions: {
                createMany: {
                    data: questions,
                },
            },
        },
        include:{
            questions: {
                include:{
                    studyWord: true,
                }
            },
        }
    });
    return studyQuiz;
}

export const createWriteQuiz = async (
  studySpaceID: string,
  studyWords: StudySpaceWordWithWord[],
) => {
  try{
      await prisma.studySpaceQuiz.deleteMany({
          where:{
              studySpaceID: studySpaceID,
              studyType: "WRITE",
          },
      })
  }
  catch(e){
      console.log("No previous writing quiz found");
  }
  // shuffle the words
  const shuffledWords = studyWords.sort(() => Math.random() - 0.5);
  const questions = shuffledWords.map((studyWord, index) => {
    const word = studyWord.word;
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
        wordID: word.wordId,
        studySpaceID: studySpaceID,
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
        wordID: word.wordId,
        studySpaceID: studySpaceID,
      };
    }
  });
  const studyQuiz = await prisma.studySpaceQuiz.create({
      data: {
          studySpace: { connect: { id: studySpaceID } },
          length: questions.length,
          studyType: "WRITE",
          questions: {
              createMany: {
                  data: questions,
              },
          },
      },
      include:{
          questions: {
              include:{
                  studyWord: true,
              }
          },
      }
  });
  return studyQuiz;
}

export const createStudyQuiz = async (
    studySpaceID: string,
    studyWords: StudySpaceWordWithWord[],
) => {
    try{
        await prisma.studySpaceQuiz.deleteMany({
            where:{
                studySpaceID: studySpaceID,
                studyType: "QUIZ",
            },
        })
    }
    catch(e){
        console.log("No previous quiz found");
    }
    // shuffle the words
    const shuffledWords = studyWords.sort(() => Math.random() - 0.5);
    const questions = shuffledWords.map((studyWord, index) => {
      const word = studyWord.word;
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
          wordID: word.wordId,
          studySpaceID: studySpaceID,
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
          wordID: word.wordId,
          studySpaceID: studySpaceID,
        };
      }
    });
  
    const studyQuiz = await prisma.studySpaceQuiz.create({
      data: {
        studySpace: { connect: { id: studySpaceID } },
        length: questions.length,
        studyType: "QUIZ",
        questions: {
          createMany: {
            data: questions,
          },
        },
      },
      include:{
        questions: {
            include:{
                studyWord: true,
            }
        },
      }
    });
    return studyQuiz;
  };

export const updateStudySpaceWord = async(
    studySpaceId: string,
    wordId: string,
    starred: boolean,
) => {
    await prisma.studySpaceWord.upsert({
        where: {
            studySpaceWordId:{
                studySpaceID: studySpaceId,
                wordID: wordId,
            }
        },
        create: {
            studySpaceID: studySpaceId,
            wordID: wordId,
            starred: starred,
        },
        update: {
            starred: starred,
        },
    });
}
export const updateStudySpaceQuestionCompleted = async (
    id: string,
    completed: boolean,
    correct: boolean,
  ) => {
    await prisma.studySpaceQuestion.update({
      where: {
        id: id,
      },
      data: {
        completed: completed,
        correctlyAnswered: correct,
      },
    });
    return;
  };


  export const updateStudyQuizCompleted = async (
    id: string,
    completed: boolean,
    score: number,
  ) => {
    const quiz = await prisma.studySpaceQuiz.findFirst({
      where: {
        id: id,
      },
    });
  
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    await prisma.studySpaceQuestion.updateMany({
      where: {
        studyQuizID: id,
      },
      data: {
        completed: completed,
      },
    });
    await prisma.studySpaceQuiz.update({
      where: {
        id: id,
      },
      data: {
        completed: completed,
        score: score,
      },
    });
    return;
  };
  
  