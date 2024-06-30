import { cache } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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