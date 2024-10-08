import StudentClassPage from "@/components/class/studentClassPage";
import { auth } from "@/auth/auth";
import { getClass } from "@/prisma/queries";
import { Suspense } from "react";
import TeacherClassPage from "@/components/class/teacherClassPage";
import { ClassSkeleton } from "@/components/class/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Class",
  description: "MX Words Words Class Page",
};

export default async function Page({
  params,
}: {
  params: { classID: string };
}) {
  const classString = params.classID;

  const thisClass = await getClass(classString);
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  if (!thisClass) {
    throw new Error("Class not found");
  }

  return (
    <div>
      {thisClass?.teacherId === userId ? (
        <Suspense fallback={<ClassSkeleton numberOfCards={2} />}>
          <TeacherClassPage
            classID={classString}
            className={thisClass.className}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<ClassSkeleton numberOfCards={3} />}>
          <StudentClassPage
            classID={classString}
            className={thisClass.className}
          />
        </Suspense>
      )}
    </div>
  );
}
