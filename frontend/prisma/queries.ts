import { cache } from "react";
import { PrismaClient, Prisma } from "@prisma/client";
import { analytics } from "googleapis/build/src/apis/analytics";

const prisma = new PrismaClient()

export type QuestionWithAnswerOptions = Prisma.QuestionGetPayload<{
    include: { answers: true }
}>
export type Answer = Prisma.AnswerGetPayload<{}>

export const getClass = cache(async ( studentID: string) => {
    const data = await prisma.user.findFirst({ where: { id: studentID } });
    const classId = data?.classClassId;
    console.log(classId);
    return classId;
})

export const getWordList = cache(async ( classID: string) => {
    const data = await prisma.class.findFirst({ 
        where: { classId: classID },
        include: { publishedWordsLists: true } 
    });
    const wordsLists = data?.publishedWordsLists;
    console.log(wordsLists);
    return wordsLists;
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

export const getQuiz = cache(async ( userID: string, quizID: string) => {
    const quiz = await prisma.quiz.findFirst({
        where: {
            userId: userID,
            quizId: quizID
        },
        include:{
            questions: true,
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
                }
            }
        }
    });
    if (!quiz){
        throw Error("Quiz not found");
    }
    
    return quiz.questions;
})