/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LQBMKWfv1iW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  FreshmanStudentInfo,
  WordsListStatus,
  freshmenColumns,
} from "../dataTables/ninthGradeTeacherColumns";
import { 
  TenElevenStudentInfo, 
  tenElevenColumns 
} from "../dataTables/tenElevenTeacherColumns";

import { TeacherDataTable } from "../dataTables/teacherTable";
import { getAllUserWordsListProgresses, getListNameAndDueDate } from "@/prisma/queries";

import { Quiz, Grade } from "@prisma/client";
import { isOverdue, dateFormatter } from "@/lib/utils";


type WordListPageProps = {
  classID: string
  wordListID: string;
  grade: Grade;
};

async function getFreshmenData(
  classId: string,
  wordListId: string,
): Promise<FreshmanStudentInfo[]> {
  const userWordsLists = await getAllUserWordsListProgresses(
    classId,
    wordListId,
  );
  const studentWordsLists = userWordsLists.filter(wordList => wordList.user.role === "STUDENT");

  const tabledata = studentWordsLists.map((listProgress) => {
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

async function getTenElevenData(
  classId: string,
  wordListId: string,
): Promise<TenElevenStudentInfo[]> {
  const userWordsLists = await getAllUserWordsListProgresses(
    classId,
    wordListId,
  );
  const studentWordsLists = userWordsLists.filter(wordList => wordList.user.role === "STUDENT");

  const tabledata = studentWordsLists.map((listProgress) => {
    const allQuiz1Data: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === 0,
    );
    const allQuiz2Data: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === 1,
    );
    const allQuiz3Data: Quiz[] = listProgress.quizzes.filter(
      (quiz) => quiz.miniSetNumber === 2,
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
      quiz3: allQuiz3Data,
      masterQuiz: allMasterQuizData,
      studentListProgress: listProgress,
      status: status,
    };
  });
  return tabledata;
}

export async function TeacherWordListHeader ( { classId, wordListID } : { classId: string, wordListID: string }) {
  const {name, dueDate} = await getListNameAndDueDate(classId, wordListID);
  return (
    <div className="flex flex-1 items-center justify-between p-6">
      <h1 className="text-2xl font-bold text-[#ff6b6b]">{name}</h1>
      <div className="flex flex-col items-center justify-between gap-2">
        {"Due Date: " + dateFormatter(dueDate!)}
      </div>
    </div>
  );
}
export default async function TeacherWordListPage({ classID, wordListID, grade }: WordListPageProps) {
  console.log("Rendering wordlist page for", wordListID);
  // Make an example of below code

  if (grade === Grade.NINE){
    const tableData = await getFreshmenData(classID, wordListID);
    return (
      <div>
        <TeacherWordListHeader classId={classID} wordListID={wordListID}/>
        <TeacherDataTable columns={freshmenColumns} data={tableData}/>
      </div>
    );
  }
  else{
    const tableData = await getTenElevenData(classID, wordListID);
    return (
      <div>
        <TeacherWordListHeader classId={classID} wordListID={wordListID}/>
        <TeacherDataTable columns={tenElevenColumns} data={tableData}/>
      </div>
    );
  }
}
