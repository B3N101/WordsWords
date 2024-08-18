import { DataTable } from "@/components/wordList/dataTables/assignListTable";
import { WordsList } from "@prisma/client";
import { columns, WordListTableType, WordsListStatus } from "@/components/wordList/dataTables/assignListColumns";
import { getAllWordsLists } from "@/prisma/queries";
import { type WordsListWithWordsAndUserWordsList } from "@/prisma/types";
import { auth } from "@/auth/auth";

async function getData(classId: string): Promise<WordListTableType[]>{
    const today = new Date();
    const data: WordsListWithWordsAndUserWordsList[] = await getAllWordsLists();

    const tabledata = data.map((wordList) => {
      const status: WordsListStatus = !wordList.UserWordsListProgress ? "Unassigned" : wordList.UserWordsListProgress[0].dueDate > today ? "Active" : "Completed";
        return {
            id: wordList.listId,
            status: status,
            name: wordList.name,
            words: wordList.words,
            classId: classId
        }
    });
    return tabledata;
}
export default async function Page({ params }: { params: { classID: string } }) {
    const classString = params.classID;
    const data = await getData(classString);
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      throw new Error("User not found");
    }
    return (
      <div>
        <DataTable columns={columns} data={data} userId={userId} classId={classString}/>
      </div>
    );
  }
  