import { google } from "googleapis";
import { PrismaClient, Grade, partOfSpeech, QuizType } from "@prisma/client";
const prisma = new PrismaClient();

async function seedWords() {
  await prisma.word.deleteMany();
  // Create a new instance of the Google Sheets API
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  try {
    // Specify the spreadsheet ID and range
    const ranges = [
      "Ninth-grade words",
      "Tenth-grade words",
      "Eleventh-grade words",
    ]; // TODO: update this later
    // Make a request to get the values from the spreadsheet
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.SHEET_ID,
      ranges: ranges,
    });

    // Extract the values from the response
    const values = response.data
      .valueRanges!.map((range) => range.values!)
      .flat();
    let getGrade = (s: string) => {
      if (s == "9") {
        return Grade.NINE;
      } else if (s == "10") {
        return Grade.TEN;
      } else return Grade.ELEVEN;
    };
    let getPartOfSpeech = (s: string) => {
      if (s == "n.") {
        return partOfSpeech.Noun;
      } else if (s == "v.") {
        return partOfSpeech.Verb;
      } else return partOfSpeech.Adjective;
    };
    const wordData = values!.map((row) => ({
      word: row[0],
      context: row[1] ? row[1] : "",
      definition: row[2] ? row[2] : "",
      partOfSpeech: row[3] ? getPartOfSpeech(row[3]) : partOfSpeech.Noun,
      exampleSentence: row[4] ? row[4] : "",
      incorrectDefinitions: row.slice(5, 10) ? row.slice(5, 10) : [""],
      gradeLevel: getGrade(row[10]),
      wordListNumber: row[14] ? parseInt(row[14]) : -1,
      rankWithinList: row[15] ? parseInt(row[15]) : -1,
    }));
    console.log(wordData);
    await prisma.word.createMany({
      data: wordData,
    });
    // console.log(word)
    console.log("Words seeded");
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Error retrieving data from spreadsheet:", error);
    return {
      props: {
        error: "Failed to retrieve data from spreadsheet",
      },
    };
  }
}
async function seedWordLists(userID: string) {
  await prisma.wordsList.deleteMany();
  console.log("WordLists deleted");
  const words = await prisma.word.findMany({
    where: {
      wordListNumber: {
        not: -1,
      },
    },
    orderBy: {
      wordListNumber: "asc",
    },
  });
  console.log(words);
  let prevWordListID = words[0].wordListNumber!;
  let currWords = [];
  for (const word of words!) {
    const wordListID = word.wordListNumber!;
    if (wordListID === prevWordListID) {
      currWords.push(word);
    }
    // time to create a new quiz out of the question bank
    else {
      await prisma.wordsList.create({
        data: {
          words: {
            connect: currWords.map((word) => ({ wordId: word.wordId })),
          },
          name: "List " + wordListID,
          UserWordsListProgress: {
            create: [
              {
                userId: userID,
              },
            ],
          },
        },
      });
      currWords = [];
      currWords.push(word); // include the first word of the new set
    }
    prevWordListID = wordListID;
  }
  console.log("WordLists seeded");
}
// async function seedQuestions(userID: string) {
//   await prisma.question.deleteMany();
//   console.log("Questions deleted");
//   const words = await prisma.word.findMany({
//     where: {
//       wordListNumber: {
//         not: -1,
//       },
//     },
//   });
//   console.log(words);
//   for (const word of words!) {
//     await prisma.question.create({
//       data: {
//         question: "What is the definition of " + word.word + "?",
//         wordId: word.wordId,
//         rank: word.rankWithinList!,
//         answers: {
//           create: [
//             {
//               answerText: word.definition,
//               correct: true,
//             },
//             {
//               answerText: word.incorrectDefinitions[0],
//               correct: false,
//             },
//             {
//               answerText: word.incorrectDefinitions[1],
//               correct: false,
//             },
//             {
//               answerText: word.incorrectDefinitions[2],
//               correct: false,
//             },
//           ],
//         },
//         userQuestionProgress: {
//           create: [
//             {
//               userId: userID,
//               completed: false,
//             },
//           ],
//         },
//       },
//     });
//   }
//   console.log("Questions seeded");
// }
// async function seedQuizzes(userID: string) {
//   await prisma.quiz.deleteMany();
//   console.log("Quizzes deleted");

//   // get all possible questions
//   const questions = await prisma.question.findMany({
//     include: { word: true },
//     orderBy: [
//       {
//         word: {
//           wordListNumber: "asc",
//         },
//       },
//     ],
//   });
//   // console.log(questions);
//   let currQuizQuestions = [];
//   let prevWordListNumberID = questions[0].word.wordListNumber!;
//   let count = 0;
//   for (const question of questions!) {
//     const wordListNumberID = question.word.wordListNumber!;
//     const wordListID = question.word.listId;
//     if (!wordListID) {
//       // getting to words that don't yet belong to a list (#TODO: fix in google sheets by adding numbers to all words)
//       console.log("Wordlist for this word not found");
//       return;
//     }
//     const userWordListProgress = await prisma.userWordsListProgress.findFirst({
//       where: {
//         userId: userID,
//         wordsListListId: wordListID,
//       },
//     });
//     // console.log(wordListID, question.word.rankWithinList);
//     if (wordListNumberID === prevWordListNumberID && count < 5) {
//       currQuizQuestions.push(question);
//     }
//     // time to create a new quiz out of the question bank
//     else {
//       await prisma.quiz.create({
//         data: {
//           wordListNumber: wordListNumberID - 1, // because we already incremented it at the end of the last loop
//           quizType: QuizType.MINI,
//           questions: {
//             connect: currQuizQuestions.map((question) => ({
//               questionId: question.questionId,
//             })),
//           },
//           words: {
//             connect: currQuizQuestions.map((question) => ({
//               wordId: question.wordId,
//             })),
//           },
//           WordsList: {
//             connect: {
//               listId: wordListID,
//             },
//           },
//           //TODO: connect userQuizProgress to corresponding wordlistProgress
//           UserQuizProgress: {
//             create: [
//               {
//                 userId: userID,
//                 completed: false,
//                 score: 0,
//                 randomSeed: Math.floor(Math.random() * 1000),
//                 wordListProgressId:
//                   userWordListProgress!.userWordsListProgressId,
//               },
//             ],
//           },
//         },
//       });
//       currQuizQuestions = [];
//       currQuizQuestions.push(question); // include the first word of the new set
//       count = 0;
//     }
//     prevWordListNumberID = wordListNumberID;
//     count += 1;
//   }
// }

async function seedAll(userID: string) {
  await seedWords();
  await seedWordLists(userID);
  // await seedQuestions(userID);
  // await seedQuizzes(userID);
}

seedAll("6aaad536-297b-4a47-b9c6-b9b90628ac01").then(async () => {
  await prisma.$disconnect();
});
// // seedWords().then(async () => {
// //         await prisma.$disconnect();
// //       })
// //   .catch(async (e) => {
// //     console.error(e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });
// // seedWordLists("6aaad536-297b-4a47-b9c6-b9b90628ac01").then(async () => {
// //       await prisma.$disconnect();
// //     })
// //     .catch(async (e) => {
// //       console.error(e);
// //       await prisma.$disconnect();
// //       process.exit(1);
// //     });
// // seedQuestions("6aaad536-297b-4a47-b9c6-b9b90628ac01").then(async () => {
// //   await prisma.$disconnect();
// // })
// // .catch(async (e) => {
// //   console.error(e);
// //   await prisma.$disconnect();
// //   process.exit(1);
// // });

// seedQuizzes("6aaad536-297b-4a47-b9c6-b9b90628ac01")
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
