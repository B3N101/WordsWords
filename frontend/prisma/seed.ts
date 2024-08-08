import { google } from "googleapis";
import {
  PrismaClient,
  Grade,
  partOfSpeech,
  QuizType,
  QuestionType,
} from "@prisma/client";

const prisma = new PrismaClient();

function getGrade(s: string) {
  if (s == "9") return Grade.NINE;
  if (s == "10") return Grade.TEN;
  return Grade.ELEVEN;
}

function getPartOfSpeech(s: string) {
  if (s == "n.") return partOfSpeech.Noun;
  if (s == "v.") return partOfSpeech.Verb;
  return partOfSpeech.Adjective;
}

async function seedWords() {
  // Ensure questions are deleted before words
  await prisma.question.deleteMany();
  console.log("Deleted questions");
  await prisma.word.deleteMany();
  console.log("Deleted words");

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.SHEET_ID,
      ranges: [
        "Ninth-grade words",
        "Tenth-grade words",
        "Eleventh-grade words",
      ],
    });

    const values = response.data
      .valueRanges!.map((range) => range.values!)
      .flat()
      .slice(1); // Skip the first row (header)

    const wordData = values.map((row) => ({
      word: row[0],
      context: row[1] || "",
      definition: row[2] || "",
      partOfSpeech: row[3] ? getPartOfSpeech(row[3]) : partOfSpeech.Noun,
      exampleSentence: row[4] || "",
      incorrectDefinitions: [row[5], row[6], row[7], row[8], row[9]],
      gradeLevel: getGrade(row[10]),
      incorrectFillIns: [row[11] || "", row[12] || "", row[13] || ""],
      wordListNumber: row[14] ? parseInt(row[14]) : 0,
      rankWithinList: row[15] ? parseInt(row[15]) : 0,
    }));
    console.log("Retrieved data from spreadsheet");

    await prisma.word.createMany({ data: wordData });
    console.log("Seeded words");
  } catch (error) {
    console.error("Error retrieving data from spreadsheet:", error);
  }
}

async function seedWordLists() {
  await prisma.wordsList.deleteMany();
  console.log("Deleted word lists");

  const words = await prisma.word.findMany({
    where: { wordListNumber: { not: 0 } },
    orderBy: { wordListNumber: "asc" },
  });
  console.log("Retrieved words");

  const wordListsMap: { [key: number]: string[] } = {};

  words.forEach((word) => {
    const listNumber = word.wordListNumber!;
    if (!wordListsMap[listNumber]) {
      wordListsMap[listNumber] = [];
    }
    wordListsMap[listNumber].push(word.wordId);
  });

  for (const number in wordListsMap) {
    await prisma.wordsList.create({
      data: {
        number: parseInt(number),
        words: { connect: wordListsMap[number].map((wordId) => ({ wordId })) },
      },
    });
  }
  console.log("Seeded word lists");
}

async function seedQuestions() {
  // Ensure quizzes are deleted before questions
  // await prisma.quiz.deleteMany();
  await prisma.question.deleteMany();
  console.log("Deleted quizzes and questions");

  const words = await prisma.word.findMany();

  for (const word of words) {
    const quiz = await prisma.quiz.findFirst({
      where: { wordsList: { words: { some: { wordId: word.wordId } } } },
    });

    if (quiz?.quizType == QuizType.LEARN) {
      await prisma.question.create({
        data: {
          type: QuestionType.CONTEXT_DEFINITION,
          content: word.word,
          answers: [word.definition],
          correctAnswer: word.definition,
          word: { connect: { wordId: word.wordId } },
          quiz: { connect: { id: quiz.id } },
        },
      });
    } else if (quiz) {
      await prisma.question.create({
        data: {
          type: QuestionType.WORD_DEFINITION,
          content: word.word,
          answers: [...word.incorrectDefinitions],
          correctAnswer: word.definition,
          word: { connect: { wordId: word.wordId } },
          quiz: { connect: { id: quiz.id } },
        },
      });

      await prisma.question.create({
        data: {
          type: QuestionType.SENTENCE_WORD,
          content: word.exampleSentence,
          answers: [...word.incorrectFillIns],
          correctAnswer: word.word,
          word: { connect: { wordId: word.wordId } },
          quiz: { connect: { id: quiz.id } },
        },
      });

      await prisma.question.create({
        data: {
          type: QuestionType.DEFINITION_WORD,
          content: word.definition,
          answers: [...word.incorrectFillIns],
          correctAnswer: word.word,
          word: { connect: { wordId: word.wordId } },
          quiz: { connect: { id: quiz.id } },
        },
      });

      if (quiz?.quizType == QuizType.MASTERY) {
        await prisma.question.create({
          data: {
            type: QuestionType.WORD_SPELLING,
            content: word.exampleSentence,
            answers: [word.word],
            correctAnswer: word.word,
            word: { connect: { wordId: word.wordId } },
            quiz: { connect: { id: quiz.id } },
          },
        });
      }
    }
  }

  console.log("Seeded questions");
}

async function seedQuizzes() {
  // await prisma.quiz.deleteMany();
  // console.log("Deleted quizzes");

  const wordsLists = await prisma.wordsList.findMany({
    include: { words: { include: { questions: true } } },
  });
  console.log("Retrieved word lists");

  for (const wordsList of wordsLists) {
    await prisma.quiz.create({
      data: {
        quizType: QuizType.BASIC,
        wordsList: { connect: { id: wordsList.id } },
        questions: {
          connect: wordsList.words.flatMap((word) =>
            word.questions.map((question) => ({ id: question.id })),
          ),
        },
      },
    });
    await prisma.quiz.create({
      data: {
        quizType: QuizType.LEARN,
        wordsList: { connect: { id: wordsList.id } },
        questions: {
          connect: wordsList.words.flatMap((word) =>
            word.questions.map((question) => ({ id: question.id })),
          ),
        },
      },
    });
    await prisma.quiz.create({
      data: {
        quizType: QuizType.MASTERY,
        wordsList: { connect: { id: wordsList.id } },
        questions: {
          connect: wordsList.words.flatMap((word) =>
            word.questions.map((question) => ({ id: question.id })),
          ),
        },
      },
    });
  }
  console.log("Seeded quizzes");
}

async function main() {
  await seedWords();
  await seedWordLists();
  await seedQuestions();
  await seedQuizzes();
}

main()
// seedQuestions()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
