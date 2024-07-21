/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LQBMKWfv1iW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableFooter,
  TableCaption,
  TableHeader,
} from "../../../components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

import {
    getWordList,
    getUserWordListProgress,
} from "@/prisma/queries";
import { auth } from "@/auth/auth";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

type ClassStatusType = "active" | "upcoming" | "completed";
type QuizStatusType = "completed" | "open" | "locked";
type LearnStatusType = "completed" | "open" | "locked";

type QuizData = {
  name: string;
  status: QuizStatusType;
  dueDate: Date;
  quizID: string;
};

type LearnData = {
  name: string;
  status: LearnStatusType;
  quizID: string;
}

interface WordListPageProps {
  wordListID: string;
}

export default async function WordListPage({ wordListID }: WordListPageProps) {
  // Make an example of below code
  const className = "Math 101";
  const classStatus: ClassStatusType = "active";
  const startDate = new Date("2022-09-01");
  const endDate = new Date("2022-12-01");
  const students = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Death Row Records",
  ];
  const teacherName = "Mr. Smith";
  const teacherId = "b6f7523b-f1a7-49d8-8543-93551ee30179";

  // get userID
  const session = await auth();
  const userId = session?.user?.id!;

  let isTeacher = false;
  if (userId == teacherId) {
    isTeacher = true;
  }
  
  // get wordList, userWordListProgress from wordListID
  const wordListData = getWordList(wordListID);
  const userWordListProgressData = getUserWordListProgress(userId, wordListID);

  const [wordList, userWordListProgress] = await Promise.all([wordListData, userWordListProgressData]);
  const userQuizProgresses = userWordListProgress?.userQuizProgresses;

  const quizData = userQuizProgresses?.map((userQuizProgress, i) => {
    const quizId = userQuizProgress.quizQuizId;
    const status: QuizStatusType = userQuizProgress.learnCompleted ? (userQuizProgress.completed ? "completed" : "open") : "locked";
    return {
      name: "Quiz " + (i + 1),
      status: status,
      quizID: quizId,
      dueDate: new Date("2022-09-15"),
    };
  });
  const learnData = userQuizProgresses?.map((userQuizProgress, i) => {
    const quizId = userQuizProgress.quizQuizId;
    let learnStatus: LearnStatusType;
    if (i == 0){
        learnStatus = userQuizProgress.learnCompleted ? "completed" : "open";
    }
    else{
        learnStatus = userQuizProgress.learnCompleted ? "completed" : (userQuizProgresses[i - 1]?.completed ? "open" : "locked");
    }
    return {
      name: "Learn " + (i + 1),
      status: learnStatus,
      quizID: quizId,
    };
  });
  // get className, teacherName, startDate, endDate from classID
  // const className = await getClassNameFromClassId(classID);
  // const startDate = await getClassStartDate(classID);
  // const endDate = await getClassEndDate(classID);
  // const students = await getClassStudents(classID);
  // const teacherName = await getTeacherNameFromClassId(classID);
  // // active, upcoming, completed
  // const classStatus = startDate < new Date() && endDate > new Date() ? "active" : startDate > new Date() ? "upcoming" : "completed";

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ff6b6b]">{className}</h1>
        <ClassStatus status={classStatus} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ff6b6b]">Quizzes</h2>
            </div>
            <div className="space-y-4">
              {quizData?.map((quizData) => (
                <Link
                  className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                  key={quizData.name}
                  href={`/quiz/${quizData.quizID}`}
                >
                  <div>{quizData.name}</div>
                  <QuizStatus status={quizData.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ff6b6b]">Learning</h2>
            </div>
            <div className="space-y-4">
              {learnData?.map((learnData) => (
                <Link
                  className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                  key={learnData.name}
                  href={`/quiz/${learnData.quizID}`}
                >
                  <div>{learnData.name}</div>
                  <LearnStatus status={learnData.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Stats />
    </div>
  );
}

function Stats() {
  return (
    <div className="mt-8">
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#ff6b6b]">Student Grades</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quiz 1</TableHead>
                <TableHead>Quiz 2</TableHead>
                <TableHead>Quiz 3</TableHead>
                <TableHead>Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>90</TableCell>
                <TableCell>85</TableCell>
                <TableCell>92</TableCell>
                <TableCell>89</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>88</TableCell>
                <TableCell>92</TableCell>
                <TableCell>87</TableCell>
                <TableCell>89</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Michael Johnson</TableCell>
                <TableCell>82</TableCell>
                <TableCell>90</TableCell>
                <TableCell>88</TableCell>
                <TableCell>87</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizStatus({ status }: { status: QuizStatusType }) {
  if (status === "completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  } else if (status === "open") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Ongoing
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Upcoming
      </div>
    );
  }
}
function LearnStatus({ status }: { status: LearnStatusType }) {
    if (status === "completed") {
      return (
        <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
          Completed
        </div>
      );
    } else if (status === "open") {
      return (
        <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
          Ongoing
        </div>
      );
    } else {
      return (
        <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
          Upcoming
        </div>
      );
    }
  }

function ClassStatus({ status }: { status: ClassStatusType }) {
  if (status === "active") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
        Active
      </div>
    );
  } else if (status === "upcoming") {
    return (
      <div className="bg-[#fef7f2] text-[#e67e22] font-medium px-3 py-1 rounded-full text-sm">
        Upcoming
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  }
}

// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/LQBMKWfv1iW
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   getClassStartDate,
//   getClassEndDate,
//   getClassStudents,
//   getClassNameFromClassId,
//   getTeacherNameFromClassId,
// } from "@/lib/userSettings";

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("");
// }

// // type classStatus = "active" | "upcoming" | "completed";
// // type QuizStatus = "completed" | "upcoming" | "ongoing";

// export default async function ClassPage({ classID }: { classID: string }) {
//   // make an example of below code
//   const className = "Math 101";
//   const classStatus = "active";
//   const startDate = new Date("2022-09-01");
//   const endDate = new Date("2022-12-01");
//   const students = [
//     "John Doe",
//     "Jane Smith",
//     "Michael Johnson",
//     "Death Row Records",
//   ];
//   const teacherName = "Mr. Smith";

//   // get className, teacherName, startDate, endDate from classID
//   // const className = await getClassNameFromClassId(classID);
//   // const startDate = await getClassStartDate(classID);
//   // const endDate = await getClassEndDate(classID);
//   // const students = await getClassStudents(classID);
//   // const teacherName = await getTeacherNameFromClassId(classID);
//   // // active, upcoming, completed
//   // const classStatus = startDate < new Date() && endDate > new Date() ? "active" : startDate > new Date() ? "upcoming" : "completed";

//   // get userID

//   return (
//     <div className="flex-1 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-[#ff6b6b]">{className}</h1>
//         {/* <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
//           {classStatus}
//         </div> */}
//         <classStatus status={classStatus} />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="bg-white rounded-lg shadow-md">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-[#ff6b6b]">Quizzes</h2>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>Quiz 1</div>
//                 <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
//                   Completed
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>Quiz 2</div>
//                 <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
//                   Upcoming
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>Quiz 3</div>
//                 <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
//                   Completed
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white rounded-lg shadow-md">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-[#ff6b6b]">Students</h2>
//             </div>
//             <div className="space-y-4">
//               {students.map((student) => (
//                 <div key={student} className="flex items-center gap-4">
//                   <Avatar className="border-2 border-[#ff6b6b]">
//                     <AvatarImage src="/placeholder-user.jpg" />
//                     <AvatarFallback>{getInitials(student)}</AvatarFallback>
//                   </Avatar>
//                   <div>{student}</div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white rounded-lg shadow-md">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-[#ff6b6b]">Teacher</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               <Avatar className="border-2 border-[#ff6b6b]">
//                 <AvatarImage src="/placeholder-user.jpg" />
//                 <AvatarFallback>{getInitials(teacherName)}</AvatarFallback>
//               </Avatar>
//               <div>{teacherName}</div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// function QuizStatus({
//   status,
// }: {
//   status: "completed" | "upcoming" | "ongoing";
// }) {
//   if (status === "completed") {
//     return (
//       <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
//         Completed
//       </div>
//     );
//   } else if (status === "ongoing") {
//     return (
//       <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
//         Ongoing
//       </div>
//     );
//   } else {
//     return (
//       <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
//         Upcoming
//       </div>
//     );
//   }
// }

// function classStatus({ status }: { status: "active" | "upcoming" | "completed" }) {
//   if (status === "active") {
//     return (
//       <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
//         Active
//       </div>
//     );
//   } else if (status === "upcoming") {
//     return (
//       <div className="bg-[#fef7f2] text-[#e67e22] font-medium px-3 py-1 rounded-full text-sm">
//         Upcoming
//       </div>
//     );
//   } else {
//     return (
//       <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
//         Completed
//       </div>
//     );
//   }
// }
