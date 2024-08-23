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
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getUserClassWordLists } from "@/prisma/queries";
import { auth } from "@/auth/auth";
import {
  getClassNameFromClassId,
  getClassTeacherId,
  getTeacherNameFromClassId,
} from "@/lib/userSettings";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

type ClassStatusType = "active" | "upcoming" | "completed";
type WordListStatusType = "completed" | "active" | "overdue";
type wordListData = {
  name: string;
  status: WordListStatusType;
  dueDate: Date;
  wordListID: string;
};

interface ClassPageProps {
  classID: string;
}

export default async function StudentClassPage({ classID }: ClassPageProps) {
  // Make an example of below code
  const className = await getClassNameFromClassId(classID);
  const classStatus: ClassStatusType = "active";
  const teacherName: string = await getTeacherNameFromClassId(classID);
  const teacherId: string = await getClassTeacherId(classID);
  // const teacherId = "b6f7523b-f1a7-49d8-8543-93551ee30179";

  // get userID
  const session = await auth();
  const userId = session?.user?.id!;
  const today = new Date();

  let isTeacher = false;
  if (userId == teacherId) {
    isTeacher = true;
  }

  const wordLists = await getUserClassWordLists(userId, classID);
  const wordListData = wordLists.map((wordList) => {
    const status: WordListStatusType = wordList.completed
      ? "completed"
      : wordList.dueDate && today.getTime() <= wordList.dueDate.getTime()
        ? "active"
        : "overdue";
    return {
      name: wordList.wordsList.name,
      status: status,
      wordListID: wordList.wordsListListId,
    };
  });
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ff6b6b]">{className}</h1>
        <ClassStatus status={classStatus} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#ff6b6b]">Word Lists</h2>
      </div>
      <div className="space-y-4">
        {wordListData.map((eachList, index) => (
          <Link
            className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
            key={index}
            href={"/class/" + classID + "/" + eachList.wordListID}
          >
            <div>{eachList.name}</div>
            <WordListStatus status={eachList.status} />
          </Link>
        ))}
      </div>
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

function WordListStatus({ status }: { status: WordListStatusType }) {
  if (status === "completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  } else if (status === "active") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Active
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#db3434] font-medium px-3 py-1 rounded-full text-sm">
        Overdue
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
