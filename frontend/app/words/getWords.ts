import prisma from "@/prisma/prisma";

export type word = {
  word: string;
  definitions: string;
};

export async function getWords() {
  const wordList = await prisma.word.findMany({ take: 10 });
  console.log(wordList);
  let words: word[] = [];
  for (let i = 0; i < wordList.length; i++) {
    words.push({ word: wordList[i].word, definitions: wordList[i].definition });
  }
  return words;
}

getWords()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
