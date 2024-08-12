/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LQBMKWfv1iW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { AttemptsTable } from "./attemptsTable";
import { createMasterQuiz, createMiniQuiz, fetchQuizzes } from "@/actions/quiz_creation";
import { auth } from "@/auth/auth";
import { Quiz } from "@prisma/client";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

type ClassStatusType = "active" | "upcoming" | "completed";
type QuizStatusType = "completed" | "open" | "locked";
type LearnStatusType = "completed" | "open" | "locked";

type QuizData = {
  name: string;
  status: QuizStatusType;
  dueDate: Date;
  quizID: string;
};

type LearnData = {
  name: string;
  status: LearnStatusType;
  quizID: string;
};

type WordListPageProps = {
  classID: string
  wordListID: string;
};

type MasterQuizProps = {
  available: boolean;
  quizID: string;
  completed: boolean;
};

export default async function WordListPage({ classID, wordListID }: WordListPageProps) {
  console.log("Rendering wordlist page for", wordListID);
  // Make an example of below code

  const className = "WordsList " + wordListID;
  const classStatus: ClassStatusType = "active";
  const teacherId = "b6f7523b-f1a7-49d8-8543-93551ee30179";

  // get userID
  const session = await auth();
  const userId = session?.user?.id!;

  let isTeacher = false;
  if (userId == teacherId) {
    isTeacher = true;
  }

  // get wordList, userWordListProgress from wordListID
  // const wordListData = getWordList(wordListID);
  // const userWordListProgressData = getUserWordListProgress(userId, wordListID);
  // const [wordList, userWordListProgress] = await Promise.all([
  //   wordListData,
  //   userWordListProgressData,
  // ]);

  const {miniQuizzes, masterQuiz} = await fetchQuizzes(wordListID, userId, classID);

  const {backupMiniQuizzes, backupMasterQuiz } = await createBackupQuizzes({ miniQuizzes, masterQuiz, wordListID, userId, classID });
  
  // filter only mini quizzes
  const quizData = miniQuizzes?.map((miniQuiz, i) => {
    const status: QuizStatusType = miniQuiz.learnCompleted
      ? miniQuiz.completed
        ? "completed"
        : "open"
      : "locked";
    return {
      name: "Quiz " + (i + 1),
      status: status,
      quizID: miniQuiz.quizId,
      dueDate: new Date("2022-09-15"),
    };
  });
  const learnData = miniQuizzes?.map((miniQuiz, i) => {
    let learnStatus: LearnStatusType;
    if (i == 0) {
      learnStatus = miniQuiz.learnCompleted ? "completed" : "open";
    } else {
      learnStatus = miniQuiz.learnCompleted
        ? "completed"
        : miniQuizzes[i - 1]?.completed
          ? "open"
          : "locked";
    }
    return {
      name: "Learn " + (i + 1),
      status: learnStatus,
      quizID: miniQuiz.quizId,
    };
  });

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ff6b6b]">{className}</h1>
        <ClassStatus status={classStatus} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ff6b6b]">Quizzes</h2>
            </div>
            <div className="space-y-4">
              {quizData?.map((quizData, i) =>
                quizData.status !== "locked" ? (
                  quizData.status === "completed" ?
                  (
                    <Link
                    className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                    key={quizData.name}
                    href={`/quiz/${backupMiniQuizzes[i]!.quizId}`}
                  >
                    <div>{quizData.name}</div>
                    <QuizStatus status={quizData.status} />
                  </Link>
                  )
                  :
                  (
                  <Link
                    className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                    key={quizData.name}
                    href={`/quiz/${quizData.quizID}`}
                  >
                    <div>{quizData.name}</div>
                    <QuizStatus status={quizData.status} />
                  </Link>
                  )
                ) : (
                  <div
                    className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                    key={quizData.name}
                  >
                    <div>{quizData.name}</div>
                    <QuizStatus status={quizData.status} />
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ff6b6b]">Learning</h2>
            </div>
            <div className="space-y-4">
              {learnData?.map((learnData) =>
                learnData.status !== "locked" ? (
                  <Link
                    className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                    key={learnData.name}
                    href={`/learn/${learnData.quizID}`}
                  >
                    <div>{learnData.name}</div>
                    <LearnStatus status={learnData.status} />
                  </Link>
                ) : (
                  <div
                    className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                    key={learnData.name}
                  >
                    <div>{learnData.name}</div>
                    <LearnStatus status={learnData.status} />
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {masterQuiz ? (
        <MasterQuiz
          quizID={masterQuiz.quizId}
          available={true}
          completed={masterQuiz!.completed}
        />
      ) : (
        <MasterQuiz quizID={"NULL"} available={false} completed={false} />
      )}
      <AttemptsTable wordsListId={wordListID} userId={userId} />
    </div>
  );
}

async function MasterQuiz({ quizID, available, completed }: MasterQuizProps) {
  return (
    <div className="mt-8">
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#ff6b6b] p-10">
              Master Quiz
            </h2>
            {available ? (
              (<Link
                className="flex flex-auto items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                key={quizID}
                href={`/quiz/${quizID}`}
              >
                <div>{"Master Quiz"}</div>
                <QuizStatus status={completed ? "completed": "open"} />
              </Link>)
            ) : (
              <div
                className="flex flex-auto items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
                key={quizID}
              >
                <div>{"Master Quiz"}</div>
                <LearnStatus status={"locked"} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizStatus({ status }: { status: QuizStatusType }) {
  if (status === "completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] hover:text-[#e6f7f2] hover:bg-[#1abc9c] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Completed - Retake
      </div>
    );
  } else if (status === "open") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] hover:bg-[#3498db] hover:text-[#f2f7fe] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Open
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#db3434] font-medium px-3 py-1 rounded-full text-sm">
        Locked
      </div>
    );
  }
}
function LearnStatus({ status }: { status: LearnStatusType }) {
  if (status === "completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] hover:text-[#e6f7f2] hover:bg-[#1abc9c] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Completed - Practice Again
      </div>
    );
  } else if (status === "open") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] hover:bg-[#3498db] hover:text-[#f2f7fe] transition ease-in-out font-medium px-3 py-1 rounded-full text-sm">
        Open
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#db3434] font-medium px-3 py-1 rounded-full text-sm">
        Locked
      </div>
    );
  }
}

function ClassStatus({ status }: { status: ClassStatusType }) {
  if (status === "active") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
        Active
      </div>
    );
  } else if (status === "upcoming") {
    return (
      <div className="bg-[#fef7f2] text-[#e67e22] font-medium px-3 py-1 rounded-full text-sm">
        Upcoming
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  }
}

type BackUpQuizProps = {
  miniQuizzes: Quiz[];
  masterQuiz: Quiz | null;
  wordListID: string;
  userId: string;
  classID: string;
}
async function createBackupQuizzes( { miniQuizzes, masterQuiz, wordListID, userId, classID}: BackUpQuizProps){
  let backupMiniQuizzes = [];
  for (let i = 0; i < miniQuizzes.length; i++) {
    if (miniQuizzes[i].completed) {
      backupMiniQuizzes.push(await createMiniQuiz(wordListID, userId, classID, i, true,));

    } else {
      backupMiniQuizzes.push(null);
    }
  }
  if (masterQuiz) {
    if (masterQuiz.completed) {
      const newMasterQuiz = await createMasterQuiz(wordListID, userId, classID);
      if (newMasterQuiz) {
        return { backupMiniQuizzes: backupMiniQuizzes, backupMasterQuiz: newMasterQuiz };
      }
    }
  }
  return { backupMiniQuizzes: backupMiniQuizzes, backupMasterQuiz: null };
}