import { getWords } from "./getWords";
import type { word } from "./getWords";

export default async function Page({ params }: { params: { slug: string } }) {
const words = await getWords(params.slug);
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
          {/* map through words list */}
          {words.map((word) => (
            <Word key={word.word} word={word.word} definition={word.definition} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Word({ word, definition }: { word: string, definition: string }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md dark:bg-[#00D1B2]">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">{word}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {definition}
        </div>
      </div>
    </div>
  );
}
