"use server";
import { Class, Grade, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new class
export async function createClass(
  className: string,
  teacherId: string,
  semesterStart: Date,
  semesterEnd: Date,
): Promise<Class> {
  return await prisma.class.create({
    data: {
      className: className,
      teacherId: teacherId,
      SemesterStart: semesterStart,
      SemesterEnd: semesterEnd,
    },
  });
}

// getClassesFromUserId
export async function getClassFromUserId(
  userId: string,
): Promise<Class[] | null> {
  return await prisma.class.findMany({
    where: { teacherId: userId },
  });
}

// Delete a class
export async function deleteClass(classId: string): Promise<Class> {
  return await prisma.class.delete({
    where: { classId: classId },
  });
}
