"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { upsertRetakesRequested } from "@/actions/quiz_progress";

import { createMiniQuiz } from "@/actions/quiz_creation";

import { upsertWordMastery } from "@/actions/word_progress";
import { type QuizWithQuestionsAndUserWordsList } from "@/prisma/types";
type Props = {
  quiz: QuizWithQuestionsAndUserWordsList;
};

export default function RequestRetakePage({ quiz }: Props) {
  const userWordsList = quiz.userWordsListProgress;
  const miniSet = quiz.miniSetNumber === -1 ? 3 : quiz.miniSetNumber; // masterQuizzes have setnumber -1

  const classId = quiz.userWordsListProgress.classId;

  // TODO: shuffle questions here
  const [requested, setRequested] = useState<boolean>(
    userWordsList.retakesRequested[miniSet],
  );
  const handleRetakeClick = () => {
    setRequested(true);
    upsertRetakesRequested(
      userWordsList.userId,
      userWordsList.wordsListListId,
      miniSet,
      true,
    );
  };
  console.log(requested);
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-xl font-bold pt-6">
        You have ran out of attempts!
      </h1>
      <main className="grid grid-cols-2 gap-6 m-12 align-middle">
        <Button
          key={0}
          onClick={() => handleRetakeClick()}
          disabled={requested}
        >
          {requested ? "Retake Requested!" : "Request Retake"}
        </Button>

        <Button
          key={1}
          onClick={() => {
            window.location.href = "/class/" + classId + "/" + quiz.wordsListId;
          }}
        >
          Back to Dashboard
        </Button>
      </main>
    </div>
  );
}
