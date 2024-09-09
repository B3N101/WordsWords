"use server";
import prisma from "@/prisma/prisma";

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
