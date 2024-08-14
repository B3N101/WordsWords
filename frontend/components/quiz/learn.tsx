"use client";

import { type Word } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { upsertLearnCompleted } from "@/actions/quiz_progress";
type Props = {
  words: Word[];
  quizId: string;
};
export default function ContextPage({ words, quizId }: Props) {
  const [onContext, setOnContext] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const handleNext = () => {
    if (onContext) {
      setOnContext(false);
      return;
    } else {
      setOnContext(true);
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  const handleBack = () => {
    if (!onContext) {
      setOnContext(true);
      return;
    } else {
      if (currentIndex - 1 >= 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };
  return (
    <div>
      {!completed ? (
        <div className="flex flex-col gap-y-10 align-middle">
          <h1 className="text-2xl font-bold text-center">
            {words[currentIndex].word}
          </h1>
          <p className="w-3/4 align-middle text-center items-center m-auto">
            {onContext
              ? words[currentIndex].context
              : words[currentIndex].definition}
          </p>
          <footer className="flow-root position: absolute bottom-3 px-6 w-full items-center justify-center">
            <div className="float-right position: absolute right-6 flex flex-col">
              <Button onClick={handleNext}>
                {onContext
                  ? "See Definition"
                  : currentIndex !== words.length - 1
                    ? "Next"
                    : "End Learning"}
              </Button>
            </div>
            <div className="float-left flex flex-col">
              {currentIndex >= 1 || !onContext ? (
                <Button onClick={handleBack}>
                  {onContext ? "Back" : "Back to Context"}
                </Button>
              ) : null}
            </div>
          </footer>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-center">
            You&apos;ve completed learning!
          </h1>
          <footer className="flow-root position: absolute bottom-3 px-6 w-full items-center justify-center">
            <div className="float-right flex flex-col">
              <Button
                onClick={async () => {
                  await upsertLearnCompleted(quizId, true);
                  window.location.href = `/quiz/${quizId}`;
                }}
              >
                Go to Quiz
              </Button>
            </div>
            <div className="float-left flex flex-col">
              <Button
                onClick={async () => {
                  await upsertLearnCompleted(quizId, true);
                  window.location.href = `/quiz`;
                }}
              >
                Back to dashboard
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
