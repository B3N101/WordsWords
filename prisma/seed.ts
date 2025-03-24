import { google } from "googleapis";

import { PrismaClient, Grade, partOfSpeech } from "@prisma/client";

const prisma = new PrismaClient();
async function findDupWordMasteries(){
  // find all instances where wordId, progressId, and classId are the same
  // connect all wordMasteries to the corresponding wordListProgress
  const wordMasteries = await prisma.userWordMastery.findMany({
    select: {
      wordId: true,
      wordsListId: true,
      classId: true,
      userId: true,
    }
  });
  let count = 0;
  for (const mastery of wordMasteries){
    const lists = await prisma.userWordsListProgress.findMany({
      where: {
        userId: mastery.userId,
        wordsListListId: mastery.wordsListId,
        classId: mastery.classId,
    }});
    if (lists.length !== 1){
      console.log("Found " + lists.length + " lists for user " + mastery.userId + " with listID " + mastery.wordsListId + " and classID " + mastery.classId);
      await prisma.userWordMastery.delete({
        where: {
          userWordMasteryId: {
            userId: mastery.userId,
            wordId: mastery.wordId,
            classId: mastery.classId
          }
        }
      });
      console.log("Deleted bad " + count);
    }
    else{
      console.log("Updating good " + count);
    }
    count++;
  }
  console.log("Finished checking for duplicates");
};

// async function seedClassIDsForQuizzes(){
//   const quizzes = await prisma.quiz.findMany({
//     where:{
//       classId: null
//     },
  
//     select: { userWordsListProgress:
//       {
//         select: { classId: true }
//       },
//       classId: true,
//       quizId: true,
//      }
//   });
//   const notNullQuizzes = await prisma.quiz.findMany({
//     where:{
//       classId: {
//         not: null
//       }
//     }
//   })
//   let i = 0
//   console.log("Found " + quizzes.length + " quizzes without a classID");
//   console.log("Found " + notNullQuizzes.length + " quizzes with a classID");
//   for (const quiz of quizzes){    
//     i++
//     console.log("Updating quiz with ID " + quiz.quizId +  " count " + i);
//     await prisma.quiz.update({
//       where: {quizId: quiz.quizId},
//       data: {
//         classId: quiz.userWordsListProgress.classId
//       }
//     })
//   }
//   console.log("Class IDs seeded for Quizzes");
// }

// async function seedClassIDsForWordMasteries(){
//   const wordMasteries = await prisma.userWordMastery.findMany({
//     where: {
//       classId: null
//     },
//     select: { 
//       userWordsListProgress: true,
//       userId: true,
//       wordId: true,
//      }
//   });
//   console.log("There are " + wordMasteries.length + " wordMasteries");
//   for (const mastery of wordMasteries){
//     await prisma.userWordMastery.update({
//       where: {userWordMasteryId: {
//         userId: mastery.userId,
//         wordId: mastery.wordId
//       }},
//       data: {
//         classId: mastery.userWordsListProgress.classId
//       }
//     })
//   }
//   console.log("Class IDs seeded for WordMasteries");
// };

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
    ]; 
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

async function seed() {
  // await seedClassIDsForQuizzes();
  // await seedClassIDsForWordMasteries();
  await findDupWordMasteries();
  await prisma.$disconnect();
}

// run the seed function
seed().then(async () => {
  await prisma.$disconnect();
});