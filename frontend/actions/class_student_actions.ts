"use server";

import { Class, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function addStudentToClass(
  classId: string,
  studentId: string,
): Promise<Class> {
  return await prisma.class.update({
    where: { classId },
    data: {
      students: {
        connect: { id: studentId },
      },
    },
  });
}
