import { getQuizzesFromWordsList } from "@/prisma/queries";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableFooter,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";
import { toEasternTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
export async function AttemptsTable({
  wordsListId,
  userId,
  classId,
}: {
  wordsListId: string;
  userId: string;
  classId: string
}) {
  const quizzes = await getQuizzesFromWordsList(wordsListId, userId, classId);
  return (
    <div className="p-6 w-full">
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#ff6b6b]">Past Attempts</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz, index) => (
                <TableRow key={index}>
                  <TableCell>{quiz.name}</TableCell>
                  <TableCell>
                    {quiz.score} / {quiz.length}
                  </TableCell>
                  <TableCell>{toEasternTime(quiz.completedAt!)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center m-auto w-full p-6">
        <WordsButton wordListID={wordsListId} />
      </div>
    </div>
  );
}


async function WordsButton({ wordListID }: { wordListID: string }) {
  return (
    <Link href={`/words/${wordListID}`} passHref>
      <button className="bg-[#ff6b6b] text-white font-bold py-2 px-4 rounded-lg">
        View Words
      </button>
    </Link>
  );
}