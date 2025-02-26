"use server";

import prisma from "@/prisma/prisma";

export async function deleteClass ( classId: string ) {
  await prisma.class.delete({
    where: { classId },
  });
}

export async function removeUserFromClass ( classId: string, userId: string ) {
  await prisma.class.update({
    where: { classId },
    data: {
      students: {
        disconnect: { id: userId },
      },
    },
  });
}