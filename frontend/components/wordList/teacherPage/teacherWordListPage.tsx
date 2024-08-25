/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LQBMKWfv1iW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  StudentInfo,
  WordsListStatus,
  columns,
} from "../dataTables/ninthGradeTeacherColumns";
import { DataTable } from "../dataTables/ninthGradeTeacherTable";

import { getAllUserWordsListProgresses } from "@/prisma/queries";

import { Card, CardContent } from "@/components/ui/card";
import { AttemptsTable } from "../studentPage/attemptsTable";
import {
  createMasterQuiz,
  createMiniQuiz,
  fetchQuizzes,
  fetchBackupMasterQuiz,
  fetchBackupMiniQuiz,
} from "@/actions/quiz_creation";
import { Quiz } from "@prisma/client";
import { isOverdue } from "@/lib/utils";

type ClassStatusType = "active" | "upcoming" | "completed";
type QuizStatusType = "completed" | "open" | "locked";
type LearnStatusType = "completed" | "open" | "locked";

type WordListPageProps = {
  userId: string;
  classID: string;
  wordListID: string;
};

async function getData(
  classId: string,
  wordListId: string,
): Promise<StudentInfo[]> {
  const userWordsLists = await getAllUserWordsListProgresses(
    classId,
    wordListId,
  );
  console.log("UserWordsLists", userWordsLists);
  const tabledata = userWordsLists.map((listProgress) => {
    const allQuiz1Data: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === 0,
    );
    const allQuiz2Data: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === 1,
    );
    const allMasterQuizData: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === -1,
    );

    const name = listProgress.user.name ? listProgress.user.name : "Unknown";
    const overDue = isOverdue(listProgress.dueDate);
    const status: WordsListStatus = listProgress.completed
      ? "Completed"
      : overDue
        ? "Overdue"
        : "Active";
    return {
      id: listProgress.userId,
      name: name,
      quiz1: allQuiz1Data,
      quiz2: allQuiz2Data,
      masterQuiz: allMasterQuizData,
      studentListProgress: listProgress,
      status: status,
    };
  });
  return tabledata;
}

export default async function TeacherWordListPage({
  userId,
  classID,
  wordListID,
}: WordListPageProps) {
  console.log("Rendering wordlist page for", wordListID);
  // Make an example of below code

  const className = "WordsList " + wordListID;
  const classStatus: ClassStatusType = "active";

  const tableData = await getData(classID, wordListID);
  return (
    <div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
