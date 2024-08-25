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

  if (!session) redirect("/api/auth/signin");

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
      <ClassDashboard data={classData} />
      {ClassAddition(role, userId)}
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
