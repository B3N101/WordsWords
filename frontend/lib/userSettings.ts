"use server";
import { Class, Grade, PrismaClient, Role, User } from "@prisma/client";

const prisma = new PrismaClient();

// USER ROLE SETTINGS
// ____________________________________________________________________________
// Get user role
export async function getUserRoleFromId(userId: string): Promise<Role> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.role!;
}

// Update user roles
const teacherRole: Role = "TEACHER";
const adminRole: Role = "ADMIN";
const studentRole: Role = "STUDENT";

export async function changeRoleToTeacher(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: teacherRole },
  });
}
export async function changeRoleToAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: adminRole },
  });
}
export async function changeRoleToStudent(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: studentRole },
  });
}

// USER NAME SETTINGS
// ____________________________________________________________________________
// Get user name
export async function getUserNameFromId(
  userId: string,
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.name;
}

// Update user name
export async function updateUserName(userId: string, newName: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { name: newName },
  });
}

// USER EMAIL SETTINGS
// ____________________________________________________________________________
// Get user email
export async function getUserEmailFromId(
  userId: string,
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.email;
}
// update user email
export async function updateUserEmail(userId: string, newEmail: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });
}

// USER CLASS SETTINGS
// ____________________________________________________________________________
// Get user class
// export async function getUserClassesFromId(userId: string): Promise<Class[]> {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { Class: true },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const classes = await prisma.class.findMany({
//     where: { teacherId: userId },
//   });
// }
export async function getUserClassesFromId(userId: string): Promise<Class[]> {
  const userWithClasses = await prisma.user.findUnique({
    where: { id: userId },
    select: { Classes: true },
  });

  if (!userWithClasses) {
    throw new Error("User not found");
  }

  return userWithClasses.Classes;
}

// get user classIds
export async function getUserClassIdsFromId(userId: string): Promise<string[]> {
  const userWithClasses = await prisma.user.findUnique({
    where: { id: userId },
    select: { Classes: true },
  });

  if (!userWithClasses) {
    throw new Error("User not found");
  }

  return userWithClasses.Classes.map((c) => c.classId);
}

// Update user class
export async function updateUserClass(userId: string, newClass: Class) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // return await prisma.user.update({
  //   where: { id: userId },
  //   data: { Class: { connect: { classId: newClass.classId } } },
  // });
  return await prisma.user.update({
    where: { id: userId },
    data: { Classes: { connect: { classId: newClass.classId } } },
  });
}

// USER CLASSNAME SETTINGS
// ____________________________________________________________________________
// Get user classname
export async function getUserClassNamesFromId(
  userId: string,
): Promise<string[]> {
  const userWithClasses = await prisma.user.findUnique({
    where: { id: userId },
    select: { Classes: true },
  });

  if (!userWithClasses) {
    throw new Error("User not found");
  }

  return userWithClasses.Classes.map((c) => c.className);
}

// USER TEACHERNAME SETTINGS
// ____________________________________________________________________________
// Get user teachername
export async function getUserTeacherIDFromId(
  userId: string,
): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { Classes: { select: { teacherId: true } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.Classes?.map((c) => c.teacherId!);
}

// get teacher name
export async function getTeacherNameFromUserId(
  userId: string,
): Promise<(string)[]> {
  const teacherId = await getUserTeacherIDFromId(userId);

  if (!teacherId) {
    // throw new Error("Teacher not found");
    return [];
  }
  const teachers = await prisma.user.findMany({
    where: { id: { in: teacherId } },
    select: { name: true },
  });

  return teachers.map((t) => t.name!);
}

// Get Class Students
export async function getClassStudents(classId: string): Promise<User[]> {
  const students = await prisma.user.findMany({
    where: { Classes: { some: { classId: classId } } },
  });

  return students;
}

// Get Class Teacher
export async function getClassTeacherId(classId: string): Promise<string> {
  const teacher = await prisma.class.findUnique({
    where: { classId: classId },
    select: { teacherId: true },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher.teacherId!;
}

// Get Class Start Date
export async function getClassStartDate(classId: string): Promise<Date> {
  const classInfo = await prisma.class.findUnique({
    where: { classId: classId },
    select: { SemesterStart: true },
  });

  if (!classInfo) {
    throw new Error("Class not found");
  }

  return classInfo.SemesterStart;
}

// Get Class End Date
export async function getClassEndDate(classId: string): Promise<Date> {
  const classInfo = await prisma.class.findUnique({
    where: { classId: classId },
    select: { SemesterEnd: true },
  });

  if (!classInfo) {
    throw new Error("Class not found");
  }

  return classInfo.SemesterEnd;
}

// Get Class Name from classID
export async function getClassNameFromClassId(classId: string): Promise<string> {
  const classInfo = await prisma.class.findUnique({
    where: { classId: classId },
    select: { className: true },
  });

  if (!classInfo) {
    throw new Error("Class not found");
  }

  return classInfo.className!;
}

// Get Class teacher name from classID
export async function getTeacherNameFromClassId(classId: string): Promise<string> {
  const teacherId = await getClassTeacherId(classId);

  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { name: true },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher.name!;
}