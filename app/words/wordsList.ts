import prisma from "@/prisma/prisma";

// Get all wordslist names

export async function getWordsLists(): Promise<
  {
    listId: string;
    name: string;
  }[]
> {
  const wordLists = await prisma.wordsList.findMany({
    select: {
      name: true,
      listId: true,
    },
  });
  return wordLists;
}
