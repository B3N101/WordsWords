import { ChooseListsTable } from "@/components/study/chooseListTable";
import StudyInterface from "@/components/study/studyInterface";
import {
  columns,
  ChooseListTableType,
} from "@/components/study/chooseListsColumns";
import {
  getAllCompletedWordsLists,
  getStudySession,
} from "@/prisma/queries";
import { auth } from "@/auth/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Study Space",
  description: "MX Words Words Study Space Page",
};

async function getData(userId: string, classId: string): Promise<ChooseListTableType[]> {
  const completedLists = await getAllCompletedWordsLists(userId, classId);
  if (!completedLists) {
    return [];
  }
  const tableData = completedLists.map((userWordList) => {
    const wordList = userWordList.wordsList;
    return {
      id: wordList.listId,
      name: wordList.name,
      words: wordList.words,
      classId: classId,
    };
  });
  return tableData;
}
export default async function Page({
  params,
}: {
  params: { classID: string };
}) {
  const classString = params.classID;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const studyData = await getStudySession(userId, classString);

  if (!studyData) {
    const createStudyData = await getData(userId, classString);
    return (
      <div>
        <ChooseListsTable
          columns={columns}
          initial_data={createStudyData}
          userId={userId}
          classId={classString}
        />
      </div>
    )
  }
  else{
    return(
      <div>
        <StudyInterface studySpace={studyData}/>
      </div>
    )
  }
}
