import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type word = {
  word: string;
  definitions: string;
};

export async function getWords(): Promise<word[]> {
  const wordList = await prisma.word.findMany({ take: 10 });
  let words: word[] = [];
  for (let i = 0; i < wordList.length; i++) {
    words.push({ word: wordList[i].word, definitions: wordList[i].definition });
  }
  return words;
}

export async function getWordsByListId(listId: string): Promise<word[]> {
  const wordList = await prisma.word.findMany({ where: { listId: listId } });
  let words: word[] = [];
  for (let i = 0; i < wordList.length; i++) {
    words.push({ word: wordList[i].word, definitions: wordList[i].definition });
  }
  return words;
}
