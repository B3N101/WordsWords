"use server";
import { auth } from "@/auth/auth";
import { PrismaClient, QuizType } from "@prisma/client";

const prisma = new PrismaClient();

export const updateUserListDueDate = async (userId: string, wordsListId: string, dueDate: Date) => {
    console.log("Changing date to ", dueDate);
    console.log("Time is ", dueDate.toUTCString(), "string is ", dueDate.toString());
    await prisma.userWordsListProgress.update({
        where:{
            userWordsListProgressId: {
                userId: userId,
                wordsListListId: wordsListId,
            }
        },
        data:{
            dueDate: dueDate,
        }
    });
}
export const deleteUserWordsListForClass = async (wordsListId: string, classId: string) => {
    console.log("Deleting user words list for class");
    const deleteWordsList = await prisma.userWordsListProgress.deleteMany({
        where:{
            wordsListListId: wordsListId,
            classId: classId,
        }
    });
}

export const createUserWordsListForClass = async (userId: string, wordsListId: string, classId: string, dueDate: Date) => {
    console.log("Fetching class")
    const currClass = await prisma.class.findFirst({
        where: {
            classId: classId,
        },
        include:{
            students: true,
        }
    });
    console.log("Class found")
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
    console.log("Creating user words list for class");

    for(const student of currClass.students){
        await prisma.userWordsListProgress.upsert({
            where:{
                userWordsListProgressId: {
                    userId: student.id,
                    wordsListListId: wordsListId,
                }
            },
            update:{
                dueDate: dueDate
            },
            create:{
                user: { connect: { id: student.id }},
                wordsList: { connect: { listId: wordsListId }},
                class: { connect: { classId: classId }},
                dueDate: dueDate,
            }
        });
    }
}