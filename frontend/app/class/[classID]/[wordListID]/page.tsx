import {
  StudentWordListQuizzes,
  StudentWordListHeader,
} from "@/components/wordList/studentPage/studentWordListPage";
import { AttemptsTable } from "@/components/wordList/studentPage/attemptsTable";
import {
  AttemptsTableSkeleton,
  QuizTableSkeleton,
  HeaderSkeleton,
} from "@/components/wordList/studentPage/skeletons";
import TeacherWordListPage from "@/components/wordList/teacherPage/teacherWordListPage";
import { TeacherDataTableSkeleton } from "@/components/wordList/teacherPage/skeleton";
import { Suspense } from "react";
import { auth } from "@/auth/auth";
import { getClass, getUserWordListProgressWithList } from "@/prisma/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { classID: string; wordListID: string };
}): Promise<Metadata> {
  const session = await auth();
  const userId: string = session?.user?.id!;
  const userWordList = await getUserWordListProgressWithList(
    userId,
    params.wordListID,
  );
  const listName = userWordList?.wordsList.name;

  return {
    title: "MX Words Words | " + listName,
    description: "MX Words Words Word List Page for " + listName,
  };
}

export default async function Page({
  params,
}: {
  params: { classID: string; wordListID: string };
}) {
  const classString = params.classID;
  const wordListString = params.wordListID;

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
        {
          thisClass?.teacherId === userId ?
          (
          <Suspense fallback={<TeacherDataTableSkeleton/>}>
            <TeacherWordListPage classID={classString} wordListID={wordListString} grade={thisClass.gradeLevel}/>
          </Suspense>
          )
          :
          (
          <div className="flex-1 p-6">
            <Suspense fallback={<HeaderSkeleton/>}>
              <StudentWordListHeader userID={userId} wordListID={wordListString} />
            </Suspense>
            <Suspense fallback={<QuizTableSkeleton/>}>
              <StudentWordListQuizzes userId={userId} classID={classString} wordListID={wordListString}/>
            </Suspense>
            <Suspense fallback={<AttemptsTableSkeleton/>}>
              <AttemptsTable wordsListId={wordListString} userId={userId}/>
            </Suspense>
          </div>
          )
        }
    </div>
  );
}
