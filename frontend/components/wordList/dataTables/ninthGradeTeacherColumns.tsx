// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Quiz, UserWordsListProgress } from "@prisma/client";
// import { upsertRetakesGranted } from "@/actions/quiz_progress";
// import { MoreHorizontal } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableCell,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableFooter,
//   TableCaption,
//   TableHeader,
// } from "@/components/ui/table";
// import { Badge } from "antd";

// export type WordsListStatus = "Unassigned" | "Completed" | "Active" | "Overdue";

// export type StudentInfo = {
//   id: string;
//   name: string;
//   quiz1: Quiz[];
//   quiz2: Quiz[];
//   masterQuiz: Quiz[];
//   studentListProgress: UserWordsListProgress & { retakesGranted?: number };
//   status: WordsListStatus;
// };

// function StudentQuizDisplay({
//   studentName,
//   quizzes,
// }: {
//   studentName: string;
//   quizzes: Quiz[];
// }) {
//   if (!quizzes || quizzes.length === 0) {
//     return <div>No quizzes taken</div>;
//   }

//   return (
//     <Table>
//       <TableCaption>Quiz Results for {studentName}</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Date</TableHead>
//           <TableHead>Score</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {quizzes.map((quiz, index) => (
//           <TableRow key={index}>
//             <TableCell>
//               {new Date(quiz.createdAt).toLocaleDateString()}
//             </TableCell>
//             <TableCell>{quiz.score}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// const ActionCell = ({ student }: { student: StudentInfo }) => {
//   const [retakesGranted, setRetakesGranted] = useState(
//     student.studentListProgress.retakesGranted || 0,
//   );

//   const handleRetakesChange = async (newRetakes: number) => {
//     // TODO: FIX THIS FUNCTION
//     let newRetakesArray = [newRetakes];

//     await upsertRetakesGranted(
//       student.studentListProgress,
//       newRetakesArray, // TODO: FIX THIS -> Originally newRetakes
//     );
//     setRetakesGranted(newRetakes);
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//         <DropdownMenuItem
//           onClick={() => handleRetakesChange(retakesGranted + 1)}
//         >
//           Grant Additional Attempt
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => handleRetakesChange(Math.max(0, retakesGranted - 1))}
//         >
//           Subtract Attempt
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <Dialog>
//           <DialogTrigger asChild>
//             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//               View Quiz Results
//             </DropdownMenuItem>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Quiz Results for {student.name}</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <StudentQuizDisplay
//                 studentName={student.name}
//                 quizzes={student.quiz1}
//               />
//               <StudentQuizDisplay
//                 studentName={student.name}
//                 quizzes={student.quiz2}
//               />
//               <StudentQuizDisplay
//                 studentName={student.name}
//                 quizzes={student.masterQuiz}
//               />
//             </div>
//           </DialogContent>
//         </Dialog>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// export const columns: ColumnDef<StudentInfo>[] = [
  
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as WordsListStatus;
//       return (
//         <Badge
//           status={
//             status === "Completed"
//               ? "success"
//               : status === "Active"
//                 ? "processing"
//                 : status === "Overdue"
//                   ? "error"
//                   : "default"
//           }
//           text={status}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "studentListProgress.retakesGranted",
//     header: "Retakes Granted",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <ActionCell student={row.original} />,
//   },
// ];

"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Quiz, UserWordsListProgress } from "@prisma/client"
import { upsertRetakesGranted } from "@/actions/quiz_progress"
import { dateFormatter } from "@/lib/utils"

import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

import { Badge } from "antd";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WordsListStatus = "Unassigned" | "Completed" | "Active" | "Overdue"

export type StudentInfo = {
  id: string
  name: string
  quiz1: Quiz[]
  quiz2: Quiz[]
  masterQuiz: Quiz[]
  studentListProgress: UserWordsListProgress
  status: WordsListStatus
}

function StudentQuizDisplay({studentName, quizzes}: {studentName: string, quizzes: Quiz[]}) {
    if(!quizzes || quizzes.length === 0) {
        return <div>Not started</div>
    }
    const completedQuizzes = quizzes.filter(quiz => quiz.completed)
    const attempts = completedQuizzes.length
    const lastAttempt = completedQuizzes[completedQuizzes.length - 1]
    const bestAttempt = completedQuizzes.reduce((best, current) => {
        if (current.score > best.score) {
            return current
        }
        return best
    }, quizzes[0])
    const numQuestions = quizzes[0].quizType === "MINI" ? 5 : 15

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-2">
                <div className="font-bold">Attempts:</div>
                <div>{attempts}</div>
            </div>
            <div className="flex flex-row space-x-2">
                <div className="font-bold">Last Attempt:</div>
                <div>{lastAttempt.score + "/" + numQuestions}</div>
            </div>
            <div className="flex flex-row space-x-2">
                <div className="font-bold">Best Attempt:</div>
                <div>{bestAttempt.score + "/" + numQuestions}</div>
            </div>
            <div className="flex flex-row space-x-2">
                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="ghost">
                        <div className="text-left">View All Attempts</div>
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{"Attempts for " + studentName}</DialogTitle>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Score</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                         {/* TODO: Make quizzes only display completed attempts. Make row action update state, use state to display attempts remaining. */}
                        {
                            completedQuizzes.map((quiz, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(quiz.completedAt) ? dateFormatter(quiz.completedAt) : dateFormatter(quiz.createdAt)}</TableCell>
                                    <TableCell>{quiz.score} / {quiz.length}</TableCell>
                                </TableRow>
                            ))
                        }
                        </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

function RetakeForm( { studentListProgress, quizRetakes, setQuizRetakes }: { studentListProgress: UserWordsListProgress, quizRetakes: number[], setQuizRetakes: (quizRetakes: number[]) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz1Retakes, setQuiz1Retakes] = useState<number>(0);
  const [quiz2Retakes, setQuiz2Retakes] = useState<number>(0);
  const [masterQuizRetakes, setMasterQuizRetakes] = useState<number>(0);

  const [attemptsRemaining1, setAttemptsRemaining1] = useState<number>(quizRetakes[0]);
  const [attemptsRemaining2, setAttemptsRemaining2] = useState<number>(quizRetakes[1]);
  const [attemptsRemainingMastery, setAttemptsRemainingMastery] = useState<number>(quizRetakes[3]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await upsertRetakesGranted(studentListProgress, [quiz1Retakes, quiz2Retakes, 0, masterQuizRetakes]);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    const newAttemptsRemaining = [attemptsRemaining1+quiz1Retakes, attemptsRemaining2+quiz2Retakes, 0, attemptsRemainingMastery+masterQuizRetakes];
    setQuizRetakes(newAttemptsRemaining);

    setAttemptsRemaining1(attemptsRemaining1 + quiz1Retakes);
    setAttemptsRemaining2(attemptsRemaining2 + quiz2Retakes);
    setAttemptsRemainingMastery(attemptsRemainingMastery + masterQuizRetakes);

    setQuiz1Retakes(0);
    setQuiz2Retakes(0);
    setMasterQuizRetakes(0);
  }

  return (
    <div>
      <div>
        <div className="flex flex-col space-x-2">
          <div className="font-bold">Current Attempts Remaining:</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz 1</TableHead>
                  <TableHead>Quiz 2</TableHead>
                  <TableHead>Master Quiz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{attemptsRemaining1}</TableCell>
                  <TableCell>{attemptsRemaining2}</TableCell>
                  <TableCell>{attemptsRemainingMastery}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </div>
        <div className="flex flex-col space-x-2">
          <div className="font-bold">Additional attempts requested for the following quizzes:</div>
          {!studentListProgress.retakesRequested.some((retake) => retake === true) ?
            <div>None</div> :
            <div>
              {studentListProgress.retakesRequested.map((retake, index) => {
                if (retake === true) {
                  if (index === 0) {
                    return <div key={index}>Quiz 1</div>
                  } else if (index === 1) {
                    return <div key={index}>Quiz 2</div>
                  } else if (index === 3) {
                    return <div key={index}>Master Quiz</div>
                  }
                }
              })}
            </div>
            }
        </div>
      </div>
      <hr className="border-t-2 border-gray-300 my-4"/>

      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col m-4">
          <div>
            <h1 className="grid place-items-center pb-4 font-bold">
              Grant Additional Attempts or Subtract Attempts
            </h1>
            <Label htmlFor="quiz1">Quiz 1</Label>
            <Input type="number"
              id="quiz1"
              value={quiz1Retakes}
              defaultValue="0"
              onChange={(e) =>
                setQuiz1Retakes(Number(e.target.value))
              }
              required
            />
            <Label htmlFor="quiz2">Quiz 2</Label>
            <Input type="number"
              id="quiz2"
              value={quiz2Retakes}
              onChange={(e) =>
                setQuiz2Retakes(Number(e.target.value))
              }
              required
            />
            <Label htmlFor="masterQuiz">Master Quiz</Label>
            <Input type="number"
              id="masterQuiz"
              value={masterQuizRetakes}
              onChange={(e) =>
                setMasterQuizRetakes(Number(e.target.value))
              }
              required
            />
          </div>
          <Button disabled={isLoading}>
            {!isLoading ? "Change Allotted Attempts" :  "Changing..." }
          </Button>
        </div>
      </form>
    </div>
  )
}

function ActionCell({ row }: { row: Row<StudentInfo> }) {
  const studentListProgress = row.original.studentListProgress;
  const retakesRequested = studentListProgress.retakesRequested;

  const [attemptsRemaining, setAttemptsRemaining] = useState(studentListProgress.quizAttemptsRemaining);
  const [notification, setNotification] = useState(retakesRequested.some((retake) => retake === true));
  
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {notification ?
          <Badge dot>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Badge>
          :
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
                setNotification(false);
              }}>
                <div>Grant Additional Attempts</div>
              </DropdownMenuItem>
            </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <RetakeForm studentListProgress={studentListProgress} quizRetakes={attemptsRemaining} setQuizRetakes={setAttemptsRemaining}/>
                </DialogHeader>
              </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
export const columns: ColumnDef<StudentInfo>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold text-lg">Student</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as WordsListStatus;
      return (
        <Badge
          status={
            status === "Completed"
              ? "success"
              : status === "Active"
                ? "processing"
                : status === "Overdue"
                  ? "error"
                  : "default"
          }
          text={status}
        />
      );
    },
  },
  {
    accessorKey: "quiz1",
    header: () => <div className="font-bold text-lg">Quiz 1</div>,
    cell: ({ row }) => {
      const quizzes: Quiz[] = row.getValue("quiz1");
      const name: string = row.getValue("name");
      return <StudentQuizDisplay studentName={name} quizzes={quizzes}/>
    },
  },
  {
    accessorKey: "quiz2",
    header: () => <div className="font-bold text-lg">Quiz 2</div>,
    cell: ({ row }) => {
      const quizzes: Quiz[] = row.getValue("quiz2");
      const name: string = row.getValue("name");
      return <StudentQuizDisplay studentName={name} quizzes={quizzes}/>
    },
  },
  {
    accessorKey: "masterQuiz",
    header: () => <div className="font-bold text-lg">Master Quiz</div>,
    cell: ({ row }) => {
      const quizzes: Quiz[] = row.getValue("masterQuiz");
      const name: string = row.getValue("name");
      return <StudentQuizDisplay studentName={name} quizzes={quizzes}/>
    },
  },
  {
    id: "actions",
    header: () => <div className="font-bold text-lg">Actions</div>,
    cell: ({ row }) => {
      // TODO: make this a separate component called ActionCell so that it can utilize useState
      return <ActionCell row={row} />
    },
  },
]

function ListStatusDisplay({ status }: { status: WordsListStatus }) {
  if (status === "Completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium text-right w-min">
        Completed
      </div>
    );
  } else if (status === "Active") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium text-right w-min">
        Active
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#db3434] font-medium text-right w-min">
         Overdue
      </div>
    );
  }
}
