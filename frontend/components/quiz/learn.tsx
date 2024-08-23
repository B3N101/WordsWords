"use client";

import { type Word } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { upsertLearnCompleted } from "@/actions/quiz_progress";
type Props = {
  words: Word[];
  quizId: string;
  classId: string;
  wordsListId: string;
};
export default function ContextPage({ words, quizId, classId, wordsListId }: Props) {
  const [onContext, setOnContext] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      {
      isLoading ?
      (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
              Loading Quiz ...
            </p>
        </div>
      )
      :
      (!completed ? (
        <div className="flex flex-col gap-10 h-dvh">
          <h1 className="text-5xl font-bold text-center mx-auto mt-20">
            {words[currentIndex].word}
          </h1>
          <p className={"w-1/2 align-middle items-center text-left text-2xl mx-auto"}>
            {onContext
              ? words[currentIndex].context
              : words[currentIndex].definition}
          </p>
          <footer className="flow-root position: absolute bottom-3 p-6 w-full items-center justify-center">
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
        <div className="flex h-dvh">
          <h1 className="text-2xl font-bold text-center m-auto">
            You&apos;ve completed learning!
          </h1>
          <footer className="flow-root position: absolute bottom-3 px-6 w-full items-center justify-center">
            <div className="float-right flex flex-col">
              <Button
                onClick={async () => {
                  setIsLoading(true);
                  await upsertLearnCompleted(quizId, true);
                  window.location.href = `/quiz/${quizId}`;
                }}
                disabled={isLoading}
              >
                {!isLoading ?"Go to Quiz" : "Loading Quiz..."}
              </Button>
            </div>
            <div className="float-left flex flex-col">
              <Button
                onClick={async () => {
                  await upsertLearnCompleted(quizId, true);
                  window.location.href = `/quiz`;
                  window.location.href = "/class/" + classId + "/" + wordsListId;
                }}
              >
                Back to dashboard
              </Button>
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
}
