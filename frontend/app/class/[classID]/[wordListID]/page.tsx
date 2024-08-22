import { StudentWordListQuizzes, StudentWordListHeader} from "@/components/wordList/studentPage/studentWordListPage";
import { AttemptsTable } from "@/components/wordList/studentPage/attemptsTable";
import { AttemptsTableSkeleton, QuizTableSkeleton, HeaderSkeleton} from "@/components/wordList/studentPage/skeletons";
import TeacherWordListPage from "@/components/wordList/teacherPage/teacherWordListPage";
import { TeacherDataTableSkeleton } from "@/components/wordList/teacherPage/skeleton";
import { Suspense } from "react";
import { auth } from "@/auth/auth";
import { getClass } from "@/prisma/queries";

export default async function Page({ params }: { params: { classID: string, wordListID: string } }) {
  const classString = params.classID
  const wordListString = params.wordListID;

  const thisClass = await getClass(classString);
  const session = await auth();
  const userId = session?.user?.id;
  if(!userId){
    throw new Error("User not found");
  }
  if(!thisClass){
    throw new Error("Class not found");
  }
  return (
    <div>
        {
          thisClass?.teacherId === userId ?
          (
          <Suspense fallback={<TeacherDataTableSkeleton/>}>
            <TeacherWordListPage userId={userId} classID={classString} wordListID={wordListString}/>
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
