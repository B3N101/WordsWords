"use server";

import { Class } from "@prisma/client";
import { connectClassActiveWordLists } from "@/actions/wordlist_assignment";
import prisma from "@/prisma/prisma";

export async function addStudentToClass(
  classId: string,
  studentId: string,
): Promise<Class> {
  await connectClassActiveWordLists(studentId, classId);

  return await prisma.class.update({
    where: { classId },
    data: {
      students: {
        connect: { id: studentId },
      },
    },
  });
}

