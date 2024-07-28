"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type UserQuizWithID } from "@/prisma/types";
import { type Quiz } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type Props = {
  quizzes: UserQuizWithID[];
  masterQuizzes: Quiz[];
};
const handleQuizSelection = (quizID: string, router: AppRouterInstance) => {
  router.push(`/quiz/${quizID}`);
};

const handleLearnSelection = (quizID: string, router: AppRouterInstance) => {
  router.push(`/learn/${quizID}`);
};
export default function Dashboard({ quizzes, masterQuizzes }: Props) {
  const router = useRouter();
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 m-12">
        {quizzes.map((quiz, i) =>
          quiz.learnCompleted ? (
            <div key={i}>
              <Button
                variant="answer_choice"
                onClick={() => handleQuizSelection(quiz.quizQuizId, router)}
              >
                Quiz {i + 1}
              </Button>
              <Button
                key={2 * i}
                variant="answer_choice"
                onClick={() => handleLearnSelection(quiz.quizQuizId, router)}
              >
                Learn {i + 1}
              </Button>
            </div>
          ) : (
            <div key={i}>
              <Button
                variant="answer_choice"
                onClick={() => handleLearnSelection(quiz.quizQuizId, router)}
              >
                Learn {i + 1}
              </Button>
            </div>
          ),
        )}
      </div>
      <div>
        <h1>Master Quizzes</h1>
        <div className="grid grid-cols-2 gap-6 m-12">
          {masterQuizzes.map((quiz, i) => (
            <Button
              key={i}
              variant="answer_choice"
              onClick={() => handleQuizSelection(quiz.quizId, router)}
            >
              Master Quiz {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
