/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LQBMKWfv1iW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { isOverdue } from "@/lib/utils";

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
  className: string;
}

export default async function StudentClassPage({
  classID,
  className,
}: ClassPageProps) {
  // get userID
  const session = await auth();
  const userId = session?.user?.id!;

  const wordLists = await getUserClassWordLists(userId, classID);
  const wordListData = wordLists.map((wordList) => {
    const status: WordListStatusType = wordList.completed
      ? "completed"
      : isOverdue(wordList.dueDate)
        ? "overdue"
        : "active";
    return {
      name: wordList.wordsList.name,
      status: status,
      wordListID: wordList.wordsListListId,
    };
  });

  const completedLists = wordListData.filter(
    (wordList) => wordList.status === "completed",
  );
  const activeLists = wordListData.filter(
    (wordList) => wordList.status === "active",
  );
  const overdueLists = wordListData.filter(
    (wordList) => wordList.status === "overdue",
  );

  return (
    <div className="flex-1 p-6 gap-y-5">
      <div className="flex items-center justify-between m-6">
        <h1 className="text-3xl font-bold text-[#ff6b6b]">{className}</h1>
      </div>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">Overdue</h2>
          </div>
          <div className="space-y-4 py-5">
            {overdueLists.map((eachList, index) => (
              <Link
                className="flex group items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                key={index}
                href={"/class/" + classID + "/" + eachList.wordListID}
              >
                <div>{eachList.name}</div>
                <WordListStatus status={eachList.status} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">Completed</h2>
          </div>
          <div className="space-y-4 py-5">
            {completedLists.map((eachList, index) => (
              <Link
                className="flex group items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                key={index}
                href={"/class/" + classID + "/" + eachList.wordListID}
              >
                <div>{eachList.name}</div>
                <WordListStatus status={eachList.status} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">Active</h2>
          </div>
          <div className="space-y-4 py-5">
            {activeLists.map((eachList, index) => (
              <Link
                className="flex group items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                key={index}
                href={"/class/" + classID + "/" + eachList.wordListID}
              >
                <div>{eachList.name}</div>
                <WordListStatus status={eachList.status} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WordListStatus({ status }: { status: WordListStatusType }) {
  if (status === "completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] group-hover:text-[#e6f7f2] group-hover:bg-[#1abc9c] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  } else if (status === "active") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] group-hover:bg-[#3498db] group-hover:text-[#f2f7fe] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Active
      </div>
    );
  } else {
    return (
      <div className="bg-[#fef2f2] text-[#db3434] group-hover:bg-[#db3434] group-hover:text-[#fef2f2] font-medium px-3 py-1 rounded-full text-sm">
        Overdue
      </div>
    );
  }
}
