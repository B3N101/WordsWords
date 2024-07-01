import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import type { answer, question, Quiz } from "./QuizQuestions";

const prisma = new PrismaClient();

const shuffle = (array: answer[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
export async function getWordList() {
  const wordList = await prisma.word.findMany({ take: 10 });
  console.log(wordList);
  let Questions: question[] = [];
  for (let i = 0; i < wordList.length; i++) {
    let answerArray: answer[] = [];
    answerArray.push({
      answerText: wordList[i].definition,
      isCorrect: true,
      id: 1,
    });
    for (let j = 0; j < wordList[i].incorrectDefinitions.length; j++) {
      answerArray.push({
        answerText: wordList[i].incorrectDefinitions[j],
        isCorrect: false,
        id: j + 2,
      });
    }
    answerArray = shuffle(answerArray);
    let question: question = {
      questionText: wordList[i].word,
      answers: answerArray,
    };
    Questions.push(question);
  }
  console.log(Questions);
  return Questions;
}

getWordList()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
