import { google } from "googleapis";
import { PrismaClient, Grade, partOfSpeech } from "@prisma/client";
const prisma = new PrismaClient();

async function seedWords() {
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
    }));
    const word = await prisma.word.createMany({
      data: wordData,
    });
    // console.log(word)
    console.log("Database seeded");
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

seedWords()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
