"use server";
import { auth } from "@/auth/auth";
import { PrismaClient, QuizType } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserWordsList = async (userId: string, wordsListId: string, classId: string) => {
    const currClass = await prisma.class.findFirst({
        where: {
            classId: classId,
        },
        include:{
            students: true,
        }
    });
    if (!currClass){
        throw new Error("Class not found");
    }
    if (currClass.teacherId !== userId){
        throw new Error("User not authorized to create words list");
    }
    const wordsList = await prisma.wordsList.findFirst({
        where: {
            listId: wordsListId,
        },
    });
    if (!wordsList){
        throw new Error("Words list not found");
    }

    for(const student of currClass.students){
        await prisma.userWordsListProgress.create({
            data:{
                user: { connect: { id: student.id }},
                wordsList: { connect: { listId: wordsListId }},
                class: { connect: { classId: classId }},
            }
        });
    }
}