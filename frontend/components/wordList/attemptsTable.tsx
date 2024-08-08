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

import { Card, CardContent } from "@/components/ui/card";

export async function AttemptsTable({ wordsListId, userId} : { wordsListId: string, userId: string }) {
    const quizzes = await getQuizzesFromWordsList(wordsListId, userId);
    return (
        <div className="mt-8">
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
                    </TableRow>
                    </TableHeader>
                    {
                        quizzes.map((quiz) => (
                            <TableRow>
                                <TableCell>{quiz.name}</TableCell>
                                <TableCell>{quiz.score}</TableCell>
                            </TableRow>
                        ))
                    }
                </Table>
                </CardContent>
            </Card>
        </div>
    );
}