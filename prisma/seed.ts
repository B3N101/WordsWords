import { google } from "googleapis";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

import { PrismaClient, Grade, partOfSpeech, QuizType } from "@prisma/client";

import OpenAI from "openai";
import path from "path";
import fs from "fs";
import util from "util";
const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      correctFillIn: row[11] ? row[11] : "",
      incorrectFillIns: row.slice(12, 15) ? row.slice(12, 15) : [""],
      wordListNumber: row[15] ? parseInt(row[15]) : -1,
      rankWithinList: row[16] ? parseInt(row[16]) : -1,
      audioSrc: "/audio/" + row[0] + ".mp3",
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

async function seedAudio() {
  const words = await prisma.word.findMany();
  for (const word of words) {
    if (word.audioSrc) {
      continue;
    }
    const filename = "./public/audio/" + word.word + ".mp3";
    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "echo",
      input: "[pause] " + word.word,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(filename, buffer);

    const audioSrc = "/audio/" + word.word + ".mp3";
    await prisma.word.update({
      where: { wordId: word.wordId },
      data: { audioSrc: audioSrc },
    });
    console.log("Audio seeded for " + word.word);
  }
}

async function seedAudioWithGoogle() {
  const client = new TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const writeFile = util.promisify(fs.writeFile);

  const words = await prisma.word.findMany();
  for (const word of words) {
    if (word.audioSrc) {
      continue;
    }
    const filename = "./public/audio/" + word.word + ".mp3";
    const [response] = await client.synthesizeSpeech({
      input: { text: word.word },
      voice: { languageCode: "en-US", ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3" },
    });
    await writeFile(filename, response.audioContent!, "binary");

    const audioSrc = "/audio/" + word.word + ".mp3";
    await prisma.word.update({
      where: { wordId: word.wordId },
      data: { audioSrc: audioSrc },
    });
    console.log("Audio seeded for " + word.word);
  }
}

// // async function seedWordMasteries(userId: string){
// //   const words = await prisma.word.findMany(); for (const word of words){ }

// //   for (const word of words){
// //     if (word.listId)
// //     {
// //       await prisma.userWordMastery.create({
// //         data: {
// //           userId: userId,
// //           wordId: word.wordId,
// //           masteryScore: 0,
// //           wordsListId: word.listId,
// //         }
// //       });
// //     }
// //   }
// //   console.log("WordMasteries seeded");
// // }
// async function seedClass(userID: string) {
//   const createdClass = await prisma.class.create({
//     data: {
//       className: "Testing Class",
//       teacherId: "TEACHERID",
//       gradeLevel: Grade.NINE,
//       SemesterStart: new Date(),
//       SemesterEnd: new Date(),
//       students: {
//         connect: {
//           id: userID,
//         },
//       },
//     },
//   });
//   console.log("Class Seeded");
//   return createdClass;
// }
async function seedAllClassWordsLists() {
  const allUserWordLists = await prisma.userWordsListProgress.findMany();
  for (const userWordList of allUserWordLists) {
    await prisma.classWordsList.upsert({
      where: {
        classWordsListId: {
          classId: userWordList.classId,
          listId: userWordList.wordsListListId,
        },
      },
      update: {},
      create: {
        class: { connect: { classId: userWordList.classId } },
        wordsList: { connect: { listId: userWordList.wordsListListId } },
        dueDate: userWordList.dueDate,
      },
    });
  }
}
async function seedWordLists() {
  await prisma.wordsList.deleteMany();
  console.log("WordLists deleted, finding words");

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
  console.log("Words found, seeding");
  console.log("First word is " + words[0]);

  let prevWordListID = words[0].wordListNumber!;
  let currWords = [];
  for (const word of words!) {
    const wordListID = word.wordListNumber!;
    if (wordListID === prevWordListID) {
      currWords.push(word);
    }
    // time to create a new quiz out of the question bank
    else {
      console.log("Current words list number is " + prevWordListID);
      await prisma.wordsList.create({
        data: {
          listId:
            "grade_" + currWords[0].gradeLevel + "_list_" + prevWordListID,
          words: {
            connect: currWords.map((word) => ({ wordId: word.wordId })),
          },
          name: "List " + prevWordListID,
          listNumber: prevWordListID,
          // UserWordsListProgress: {
          //   create: [
          //     {
          //       userId: userID,
          //       classId: classID,
          //     },
          //   ],
          // },
        },
      });
      currWords = [];
      currWords.push(word); // include the first word of the new set
    }
    prevWordListID = wordListID;
  }
  await prisma.wordsList.create({
    data: {
      listId:
        "grade_" +
        currWords[0].gradeLevel +
        "_list_" +
        currWords[0].wordListNumber,
      words: {
        connect: currWords.map((word) => ({ wordId: word.wordId })),
      },
      name: "List " + currWords[0].wordListNumber,
      listNumber: currWords[0].wordListNumber,
      // UserWordsListProgress: {
      //   create: [
      //     {
      //       userId: userID,
      //       classId: classID,
      //     },
      //   ],
      // },
    },
  });
  console.log("WordLists seeded");
}

// async function seedAll(userID: string) {
//   await seedWords();
//   // await seedClass(userID);
//   await seedWordLists();
//   // await seedWordMasteries(userID);
//   // await seedQuestions(userID);
//   // await seedQuizzes(userID);
// }

// seedAll("f23447e0-738b-431f-aefe-b286f027f25e").then(async () => {
//   await prisma.$disconnect();
// });
// async function seedAudioAndWords() {
//   await seedWords();
//   await seedAudioWithGoogle();
// }
// async function seedWordsAndWordsLists() {
//   await seedWords();
//   await seedWordLists();
// }
// seedWordsAndWordsLists().then(async () => {
//   await prisma.$disconnect();
// });

seedAllClassWordsLists().then(async () => {
  await prisma.$disconnect();
});
