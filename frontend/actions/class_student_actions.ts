"use server";

import { Class } from "@prisma/client";
import prisma from "@/prisma/prisma";

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
