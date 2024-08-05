// List of words with lazy loaded terms and definitions
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { PrismaClient } from "@prisma/client";
import { getWords } from "./getWords";
import type { word } from "./getWords";

const prisma = new PrismaClient();

export default async function Page() {
  let words = await getWords();
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
            <Word key={word.word} word={word} />
          ))}
        </div>
      </div>
    </div>
  );
}

// get 10 words from the database and their definitions and put them in a list to be iterated over

// export async function getWords() {
//     const wordList = await prisma.word.findMany( {take: 10} );
//     console.log(wordList);
//     return wordList;
// }

// getWords()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// component for displaying a word and its definition: word : definitions
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

// getStaticProps fetches words from the database

// export async function getStaticProps() {
//   const words = await prisma.word.findMany();
//   return {
//     props: {
//       words,
//     },
//   };
// }
