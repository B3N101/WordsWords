import StudentWordListPage from "@/components/wordList/studentWordListPage";
import TeacherWordListPage from "@/components/wordList/teacherWordListPage";
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

  console.log("Redering wordlist page for", wordListString);
  console.log("Class is ", classString);
  return (
    <div>
      {/* Add your class page content here */}
      <Suspense>
        {
          thisClass?.teacherId === userId ?
          <TeacherWordListPage userId={userId} classID={classString} wordListID={wordListString}/>
          :
          <StudentWordListPage userId={userId} classID={classString} wordListID={wordListString}/>
        }
      </Suspense>
    </div>
  );
}
