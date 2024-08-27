import { DataTable } from "@/components/wordList/dataTables/assignListTable";
import { WordsList } from "@prisma/client";
import { columns, WordListTableType, WordsListStatus } from "@/components/wordList/dataTables/assignListColumns";
import { getAllWordsListsAssigned, getAllWordListsNotAssigned, getUserRole } from "@/prisma/queries";
import { isOverdue } from "@/lib/utils";
import { type WordsListWithWordsAndUserWordsList } from "@/prisma/types";
import { auth } from "@/auth/auth";
import type { Metadata } from "next";
import { get } from "http";

export const metadata: Metadata = {
  title: "MX Words Words | Assign List",
  description: "MX Words Words Assign List Page",
};

async function getData(classId: string): Promise<WordListTableType[]>{
    const today = new Date();

    const unassignedLists = await getAllWordListsNotAssigned(classId);
    const assignedLists = await getAllWordsListsAssigned(classId);
    const tableData1 = assignedLists.map((wordList) => {
      const status = isOverdue(wordList.UserWordsListProgress[0].dueDate) ? "Completed" : "Active";
        return {
            id: wordList.listId,
            status: status as WordsListStatus,
            grade: wordList.words[0].gradeLevel,
            name: wordList.name,
            words: wordList.words,
            classId: classId
    }});
    const tableData2 = unassignedLists.map((wordList) => {
        return {
            id: wordList.listId,
            status: "Unassigned" as WordsListStatus,
            grade: wordList.words[0].gradeLevel,
            name: wordList.name,
            words: wordList.words,
            classId: classId
        }
    });

    const tableData = tableData1.concat(tableData2);
    return tableData;
}
export default async function Page({
  params,
}: {
  params: { classID: string };
}) {
  const classString = params.classID;
  const data = await getData(classString);
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const role = await getUserRole(userId);
  if (role === "STUDENT") {
    throw new Error("User not authorized");
  }
  return (
    <div>
      <DataTable
        columns={columns}
        initial_data={data}
        userId={userId}
        classId={classString}
      />
    </div>
  );
}
