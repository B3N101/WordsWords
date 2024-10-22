"use client";

import { type Word } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import AudioButton from "../audioButton";
import { StarButton } from "./singleWordDisplay";

import ProgressBar from "@/components/progressBar";
import {
    updateStudySpaceWord,
    updateStudySpaceQuestionCompleted,
    updateStudyQuizCompleted,
} from "@/actions/study_space";

import { type StudyQuizWithQuestions } from "@/prisma/types";
type Props = {
  quiz: StudyQuizWithQuestions;
  classID: string;
};
type PageContentType = "blank" | "definition" | "context";


export default function StudyFlashcardPage({
  quiz,
  classID,
}: Props) {
    const questions = quiz.questions;
    const studySpaceID = quiz.studySpaceID;
    // sort questions by their rank attribute:
    questions.sort((a, b) => a.rank - b.rank);
    const words = questions.map((question) => question.studyWord.word);
  
  const [pageContent, setPageContent] = useState<PageContentType>("blank");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isUpserted, setIsUpserted] = useState<boolean>(false);

  const [isStarred, setIsStarred] = useState<boolean>(
    questions[currentIndex].studyWord.starred
  );
  const [isStarButtonDisabled, setIsStarButtonDisabled] = useState<boolean>(
    false,
  );

   const handleNext = async(makeStarred: boolean) => {
    setIsButtonDisabled(true);
    await updateStudySpaceQuestionCompleted(
      questions[currentIndex].id,
      true,
      true,
    );
    await updateStudySpaceWord(studySpaceID, questions[currentIndex].wordID, makeStarred); // unstar it
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await updateStudyQuizCompleted(quiz.id, true, 0);
      setCompleted(true);
      setIsUpserted(true);
    }
    setIsButtonDisabled(false);
  }

  const handleStarClick = async(wordID: string) => {
    setIsStarButtonDisabled(true);
    setIsStarred(!isStarred);
    if (isStarred) {
        //unstar
      await updateStudySpaceWord(studySpaceID, wordID, false);
    } else {
        //star
      await updateStudySpaceWord(studySpaceID, wordID, true)
    }
    setIsStarButtonDisabled(false);
    return;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
            Loading Flashcards ...
          </p>
        </div>
      ) : !completed ? (
        <div className="flex flex-col gap-10 h-dvh">
            <header className="pb-10 pt-10 flex-col items-center align-middle">
              <ProgressBar
                value={((currentIndex + 1) / questions.length) * 100}
              />
              <div className="text-center pt-5">
                Card {currentIndex + 1} / {questions.length}
              </div>
        </header>
        <h1 className="flex flex-row gap-3 text-5xl font-bold text-center mx-auto mt-20">
            {words[currentIndex].word}
            {words[currentIndex].audioSrc ? (
              <AudioButton src={words[currentIndex].audioSrc} />
            ) : null}
            <Button
                    onClick={() => handleStarClick(words[currentIndex].wordId)}
                    disabled={isStarButtonDisabled}
                >
                    {isStarred ? 
                        <Star className="h-4 w-4" fill="black" strokeWidth={0} /> : 
                        <Star className="h-4 w-4" />}
            </Button>
          </h1>
          {pageContent === "blank" ? (
            <h2 className="text-2xl font-semibold text-center mx-auto">
              {words[currentIndex].partOfSpeech}
            </h2>
          ) : null}
          <p
            className={
              pageContent === "context"
                ? "w-1/2 align-middle items-center text-left text-2xl mx-auto"
                : "w-1/2 align-middle items-center text-center text-2xl mx-auto"
            }
          >
            {pageContent === "blank" ? null : (pageContent === "context"
              ? words[currentIndex].context
              : words[currentIndex].definition)}
          </p>
          <footer className="flex group items-center justify-between">
            <div className="float-right position: absolute right-6 flex flex-col">
              <Button onClick={() => {
                setPageContent("definition");
              }}>
                See Definition
              </Button>
            </div>
            <div className="grid-cols-2 w-auto m-auto">
                <Button onClick={() => handleNext(true)}
                    variant="incorrect"
                    disabled={isButtonDisabled}
                >
                    I don't know this
                </Button>
                <Button onClick={() => handleNext(false)}
                    variant="correct"
                    disabled={isButtonDisabled}
                >
                    I know this
                </Button>
            </div>
            <div className="float-left flex flex-col">
              <Button onClick = {() => {
                setPageContent("context");
              }}>
                See Context
              </Button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex h-dvh">
          <h1 className="text-2xl font-bold text-center m-auto">
            You&apos;ve completed flashcards!
          </h1>
          <div className="grid grid-cols-1 gap-6 m-12">
            <Button
              onClick={async () => {
                if (!isUpserted){
                  await updateStudyQuizCompleted(quiz.id, true, 0);
                }
                window.location.href =
                  "/class/" + classID + "/study";
              }}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
