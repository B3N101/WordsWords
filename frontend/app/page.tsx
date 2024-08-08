import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import Profile from "@/components/profile";
import ClassDashboard from "@/components/class/classBoard";
import {
  getTeacherNameFromUserId,
  getClassEndDate,
  getClassStartDate,
  getUserClassNamesFromId,
  getUserRoleFromId,
} from "@/lib/userSettings";
import { getUserClassIdsFromId } from "@/lib/userSettings";

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

  classData.push({
    className: "Math",
    teacherName: "Mr. Smith",
    // make sure to change the date to a valid date
    startDate: new Date("2022-09-01"),
    endDate: new Date("2022-12-01"),
    classID: "1234",
  });

  classData.push({
    className: "Math",
    teacherName: "Mr. Smith",
    // make sure to change the date to a valid date
    startDate: new Date("2024-09-01"),
    endDate: new Date("2027-12-01"),
    classID: "1234",
  });

  const role = await getUserRoleFromId(userId);

  return (
    <div>
      <ClassDashboard data={classData} />

      {/* {If Role is teacher or admin then add teacherDashboard where a teacher can add students} */}
      {( role == "TEACHER" || role == "ADMIN") ? (
        <p>Is A Teacher</p>
      ) : (
        <p>Is Not A Teacher</p>
      )
    }
      <footer>
        {/* horizontal line*/}
        <hr />
        <p className="text-green-600 font-extrabold text-xl">Home</p>
        <Profile user={User} />
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </footer>
    </div>
  );
}