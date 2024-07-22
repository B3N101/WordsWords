import { cache } from "react";
import { PrismaClient, Prisma } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";

const prisma = new PrismaClient()

export const getUserWordLists = cache(async ( userID: string) => {
    const data = await prisma.publishedList.findMany({
        where: { userId: userID },
        include: {list: true}
    });
    return data;
})
export const getWordList = cache(async ( wordListID: string) => {
  const data = await prisma.wordsList.findFirst({
      where: { listId: wordListID },
      include: { words: true }
  });

  return data;
})

export const getUserWordListProgress = cache(async ( userID: string, wordListID: string) => {
    const data = await prisma.userWordsListProgress.findFirst({
        where: { userId: userID, wordsListListId: wordListID },
        include: { userQuizProgresses: true}
    });
    return data;
})

// TODO: temporary getwords to test. Change this later
export const getWords = cache(async () => {
    const data = await prisma.word.findMany(
        {
            take: 10
        }
    );
    return data;
})
export const getWordListWords = cache(async ( wordListID: string) => {
    const data = await prisma.wordsList.findFirst({ 
        where: { listId: wordListID },
        include: { words: true } 
    });
    const words = data?.words;
    console.log(words);
    return words;
})
export const getUserQuizzes = cache(async (userID: string) => {
    const data = await prisma.userQuizProgress.findMany({ 
        where: { userId: userID },
        select: { quizQuizId: true,
                  learnCompleted: true,
        } 
    });
    return data;
})
export const getUserQuizProgress = cache(async ( userID: string, quizID: string) => {
    const data = await prisma.userQuizProgress.findFirst({ 
        where: { userId: userID, quizQuizId: quizID },
        include: { quiz: {
            include:{
                questions:{
                    include:{
                        answers: true,
                        userQuestionProgress: {
                            where:{
                                userId: userID
                            }
                        }
                    },
                    orderBy:{
                        questionId: 'asc'
                    }
                }
            }
        }}
    });
    return data;
})
export const getQuiz = cache(async ( quizID: string) => {
    const quiz = await prisma.quiz.findFirst({
        where: {
            quizId: quizID
        },
        include:{
            questions:{
                include:{
                    answers: true
                },
                orderBy:{
                    questionId: 'asc'
                }
            }
        }
    });
    if (!quiz){
        throw Error("Quiz not found");
    }
    return quiz;
})

export const getQuestions = cache(async ( quizID: string) => {
    const quiz = await prisma.quiz.findFirst({
        where: {
            quizId: quizID
        },
        include:{
            questions:{
                include:{
                    answers: true
                },
                orderBy:{
                    questionId: 'asc'
                }
            }
        }
    });
    if (!quiz){
        throw Error("Quiz not found");
    }
    
    return quiz.questions;
})

export const getQuizWords = cache(async ( quizID: string) => {
    const quiz = await prisma.quiz.findFirst({
        where: {
            quizId: quizID
        },
        select:{
            words: true
        }
        
    });

    if(!quiz){
        throw new Error("Quiz not found");
    }
    return quiz.words;
})