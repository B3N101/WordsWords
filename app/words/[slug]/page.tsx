import { getWords } from "./getWords";
import type { word } from "./getWords";

export default async function Page({ params }: { params: { slug: string } }) {
  const words = await getWords(params.slug);
  return (
    <div className="flex items-center justify-center mt-4">
      <div className="mx-auto space-y-6 rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[#ff6b6b]">Words</h1>
          <p className="text-gray-600">Learn new words and their definitions</p>
        </div>
        <div className="space-y-4">
          {/* map through words list */}
          {words.map((word) => (
            <Word
              key={word.word}
              word={word.word}
              definition={word.definition}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Word({ word, definition }: { word: string; definition: string }) {
  return (
    <div className="flex w-fullitems-center justify-between bg-white p-4 rounded-md dark:bg-[#ff6b6b] border-gray-600 border-2">
      <div className="flex items-center gap-4">
        <div className="text-lg text-gray-600 font-semibold">{word}</div>
        <div className="text-sm text-gray-600">{definition}</div>
      </div>
    </div>
  );
}
