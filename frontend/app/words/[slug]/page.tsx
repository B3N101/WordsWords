import { getWordsByListId } from "@/app/words/getWords";

export default async function Page({ params }: { params: { slug: string } }) {
  let words = await getWordsByListId(params.slug);

  if (words.length === 0) throw new Error("Word list not found");

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
          {words.map((word) => (
            <Word key={word.word} word={word} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Word({ word }: { word: { word: string; definitions: string } }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md dark:bg-[#00D1B2]">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">{word.word}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {word.definitions}
        </div>
      </div>
    </div>
  );
}
