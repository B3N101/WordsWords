"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { upsertQuestionCompleted } from "@/actions/quiz_progress";
import type { QuestionWithAnswerOptions, Answer } from "@/prisma/queries";

type Props = {
  quizId: string
  questions: QuestionWithAnswerOptions[]
}

export default function QuizPage({quizId, questions}: Props) {
  const [started, setStarted] = useState(false);
  // return the first uncompleted question
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const uncompletedIndex = questions.findIndex((question) => !question.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [score, setScore] = useState<number>(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const question = questions[currentIndex];
  const options = question.answers;
  /*TODO: Track user progress so that refresh sends them to the current answer*/
  const handleAnswerClick = (answer: Answer) => {
    setIsCurrentCorrect(answer.correct);
  };

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      if (isCurrentCorrect !== null) {
        upsertQuestionCompleted(questions[currentIndex].questionId, isCurrentCorrect);
      }
      else{
        throw Error("No answer selected")
      }
    } 
    else {
      setSubmitted(true);
      return;
    }
    setIsCurrentCorrect(null);
  };
  return (
    <div>
      {!submitted ? (
        <div className="flex flex-col flex-1">
          <div>
            <header>
              <ProgressBar value={(currentIndex / questions.length) * 100} />
            </header>
          </div>
          <main className="flex justify-center flex-1">
            {!started ? (
              <h1 className="text-3xl font-bol">Demo Words Quiz</h1>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">
                  {questions[currentIndex].question}
                </h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {questions[currentIndex].answers.map((answer) => (
                    <Button
                      key={answer.answerId}
                      variant="answer_choice"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      {answer.answerText}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </main>
          <footer className="flow-root pb-9 px-6 bottom mb-0">
            <div className="float-right flex flex-col">
              <p>{isCurrentCorrect ? "correct" : "incorrect"}</p>
              <Button onClick={handleNext}>
                {!started
                  ? "Start"
                  : currentIndex !== questions.length - 1
                    ? "Next"
                    : "Submit"}
              </Button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center">
          <h1>Quiz Results</h1>
          <p>
            You scored {score} out of {questions.length}
          </p>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </div>
      )}
    </div>
  );
}
