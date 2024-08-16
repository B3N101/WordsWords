import { DataTable } from "@/components/wordList/dataTable";
import { WordsList } from "@prisma/client";
import { columns, WordListTableType, WordsListStatus } from "@/components/wordList/dataColumns";
import { CheckboxReactHookFormMultiple } from "@/components/wordList/formTest";
import { getAllWordsLists } from "@/prisma/queries";
import { type WordsListWithWordsAndUserWordsList } from "@/prisma/types";

async function getData(): Promise<WordListTableType[]>{
    const today = new Date();
    const data: WordsListWithWordsAndUserWordsList[] = await getAllWordsLists();

    const tabledata = data.map((wordList) => {
      const status: WordsListStatus = !wordList.UserWordsListProgress ? "Unassigned" : wordList.UserWordsListProgress[0].dueDate > today ? "Active" : "Completed";
        return {
            id: wordList.listId,
            status: status,
            name: wordList.name,
        }
    });
    return tabledata;
}
export default async function Page({ params }: { params: { classID: string } }) {
    const classString = params.classID;
    const data: WordsListWithWordsAndUserWordsList[] = await getAllWordsLists();
    
    return (
      <div>
        Data Table Page
        {/* Add your class page content here */}
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
  