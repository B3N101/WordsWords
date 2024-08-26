"use server";
import { Class, Grade, Role } from "@prisma/client";
import prisma from "@/prisma/prisma";

// Create a new class
export async function createClass(
  className: string,
  teacherId: string,
  semesterStart: Date,
  semesterEnd: Date,
  grade: Grade,
): Promise<Class> {
  return await prisma.class.create({
    data: {
      className: className,
      teacherId: teacherId,
      SemesterStart: semesterStart,
      SemesterEnd: semesterEnd,
      gradeLevel: grade,
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
