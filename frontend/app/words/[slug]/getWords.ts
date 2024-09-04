import prisma from "@/prisma/prisma";

export type word = {
  word: string;
  definitions: string;
};

export async function getWords(listId: string) {
  const wordList = await prisma.wordsList.findFirst({
    where: {
      listId: listId,
    },
    select: {
      words: {
        select: {
          word: true,
          definition: true,
        },
      },
    },
  });
  if (!wordList) {
    throw new Error("List not found");
  }
  const words = wordList.words;
  return words;
}
