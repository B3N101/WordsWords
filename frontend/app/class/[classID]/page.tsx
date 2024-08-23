import ClassPage from "@/components/class/classPage";
import StudentClassPage from "@/components/class/studentClassPage"
import { auth } from "@/auth/auth";
import { getClass } from "@/prisma/queries";
import { Suspense } from "react";
import TeacherClassPage from "@/components/class/teacherClassPage";

export default async function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID;

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
        <Suspense fallback={null}>
          <TeacherClassPage classID={classString} className={thisClass.className}/>
        </Suspense>
      )
      :
      (
      <div className="flex-1 p-6">
        <Suspense fallback={null}>
          <StudentClassPage classID={classString} className={thisClass.className}/>
        </Suspense>
      </div>
      )
    }
  </div>
  );
}
