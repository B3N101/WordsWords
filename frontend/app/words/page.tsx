import Link from "next/link";
import { getWordsLists } from "./wordsList";
import { Button } from "@/components/ui/button";

// create a grid of buttons for each word list name in the database, where each button links to the corresponding word list page

export default async function Page() {
  const wordLists = await getWordsLists();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F0FFF4] dark:bg-[#00B894]">
      <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-[#00D1B2]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[#00B894]">Words</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Learn new words and their definitions
          </p> 
        </div>
        <div className="space-y-4">
          {wordLists.map((list) => (
            <Link key={list.listId} href={`/words/${list.listId}`}>
              <Button>{list.name}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
