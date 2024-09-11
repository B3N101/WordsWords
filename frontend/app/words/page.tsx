import Link from "next/link";
import { getWordsLists } from "./wordsList";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Wordslist Home",
  description: "Middlesex School's Vocab Trainer - Wordslist Home",
};

export default async function Page() {
  const wordLists = await getWordsLists();

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto space-y-6 rounded-lg p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[#00B894]">Words</h1>
          <p className="text-gray-600">Learn new words and their definitions</p>
        </div>
        <div className="space-y-4">
          {wordLists.map((list) => (
            <Link key={list.listId} href={`/words/${list.listId}`}>
              <Button className="w-full sm:w-[48%] mb-2 sm:mx-[1%]">{list.name}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
