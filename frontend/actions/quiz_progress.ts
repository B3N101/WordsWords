"use server";
import { auth } from "@/auth/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const upsertQuestionCompleted = async (questionId: string, completed: boolean) => {
    const session = await auth();
    const userId = session?.user?.id;
    console.log(userId)
    // const quizQuestion = prisma.question.findFirst({
    //     where: {
    //         questionId: questionId,
    //         userId: userId
    //     }
    // });
    // quizQuestion.update({

    // })
    // const updatedQuizQuestion = await prisma.question.update({
    //     where: {
    //         questionId: questionId,
    //         userId: userId
    //     },
    //     data: {
    //         completed: progress
    //     }
    // });

        
}
