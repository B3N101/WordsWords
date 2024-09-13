import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import ClassDashboard from "@/components/class/classBoard";
import {
  getTeacherNameFromUserId,
  getClassEndDate,
  getClassStartDate,
  getUserClassNamesFromId,
  getUserRoleFromId,
} from "@/lib/userSettings";
import { getUserClassIdsFromId } from "@/lib/userSettings";
import CreateClassCard from "@/components/classUtils/createClass";
import JoinClassCard from "@/components/classUtils/joinClass";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// type classData to be used to get custom classDashboard
type classData = {
  className: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  classID: string;
};

export default async function Home() {
  const session = await auth();

  // if (!session) redirect("/api/auth/signin");
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl font-bold mb-6">Welcome to MX Words Words</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Enhance your vocabulary and language skills with our interactive
          learning platform. Join classes, take quizzes, and track your progress
          effortlessly.
        </p>
        <Link href="/login" passHref>
          <Button className="px-6 py-2">Login to Get Started</Button>
        </Link>
      </div>
    );
  }

  const User = {
    name: session.user!.name,
    image: session.user!.image,
  };

  // get class data map
  const classData: classData[] = [];
  const userId = session.user!.id!;
  const classIds = await getUserClassIdsFromId(userId);
  const classNames = await getUserClassNamesFromId(userId);
  const teacherNames = await getTeacherNameFromUserId(userId);
  const startDates = (await Promise.all(classIds.map(getClassStartDate))).map(
    (date) => new Date(date),
  );
  const endDates = (await Promise.all(classIds.map(getClassEndDate))).map(
    (date) => new Date(date),
  );

  if (classIds.length === 0) {
    redirect("/joinClass");
  }
  for (let i = 0; i < classIds.length; i++) {
    classData.push({
      className: classNames[i],
      teacherName: teacherNames[i],
      startDate: startDates[i],
      endDate: endDates[i],
      classID: classIds[i],
    });
  }

  const role = await getUserRoleFromId(userId);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">Welcome to MX Words Words</h1>
        <p className="text-xl mb-8">
          Enhance your vocabulary and language skills with our interactive
          learning platform. Join classes, take quizzes, and track your progress
          effortlessly.
        </p>
      </div>
      <ClassDashboard data={classData} />
      {/* {ClassAddition(role, userId)} */}
    </div>
  );
}

function ClassAddition(role: string, userId: string): JSX.Element {
  return role == "TEACHER" || role == "ADMIN" ? (
    <CreateClassCard teacherId={userId} />
  ) : (
    <JoinClassCard userId={userId} />
  );
}
