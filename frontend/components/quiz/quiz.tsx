"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import {
  upsertQuestionCompleted,
  upsertQuizCompleted,
} from "@/actions/quiz_progress";
import { upsertWordMastery } from "@/actions/word_progress";
import { type Answer, type UserQuizProgressWithQuiz } from "@/prisma/types";
type Props = {
  userQuiz: UserQuizProgressWithQuiz;
};

export default function QuizPage({ userQuiz }: Props) {
  const quiz = userQuiz.quiz;
  const questions = quiz.questions;
  const wordsListId = quiz.wordsListListId;
  if (!userQuiz.learnCompleted && quiz.quizType === "MINI"){
    return (
      <div>
        key={0}
        <div>      
          Learn Mode not Completed Yet!
        </div>
        <Link
          className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
          href={`/learn/${userQuiz.quizQuizId}`}
        >
          <div>Go to Learn</div>
        </Link>
      </div>)
  }
  console.log(quiz);
  const userQuestions = questions
    .map((question) => question.userQuestionProgress)
    .flat(); // flatten from a [[],[],[]] to [, , ,]
  // TODO: shuffle questions here
  const [completed, setCompleted] = useState<boolean>(userQuiz.completed);

  const [started, setStarted] = useState<boolean>(() => {
    return userQuestions.some((question) => question.completed);
  });
  // return the first uncompleted question
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const uncompletedIndex = userQuestions.findIndex(
      (question) => !question.completed,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  console.log(questions, currentIndex);
  const [score, setScore] = useState<number>(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(
    null,
  );

  const question = questions[currentIndex];
  const options = question.answers;
  /*TODO: Track user progress so that refresh sends them to the current answer*/
  const handleAnswerClick = (answer: Answer) => {
    setIsCurrentCorrect(answer.correct);
  };

  const handleNext = async () => {
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
        upsertQuestionCompleted(
          userQuestions[currentIndex].userQuestionProgressId,
          true,
        );
        upsertWordMastery(question.wordId, isCurrentCorrect);
      } else {
        throw Error("No answer selected");
      }
    } else {
      await upsertQuizCompleted(userQuiz.userQuizProgressId, true);
      setCompleted(true);
      return;
    }
    setIsCurrentCorrect(null);
  };
  return (
    <div>
      {!completed ? (
        <div className="flex flex-col flex-1">
          <div>
            <header>
              <ProgressBar value={(currentIndex / questions.length) * 100} />
            </header>
          </div>
          <main className="flex justify-center flex-1">
            {!started ? (
              <h1 className="text-3xl font-bol">Quiz {quiz.quizId}</h1>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{question.question}</h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {options.map((answer) => (
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
          <div>
            <Button
              onClick={async () => {
                await upsertQuizCompleted(userQuiz.userQuizProgressId, false);

                // TODO: switch to updating react states, remove async
                window.location.reload();
              }}
            >
              {" "}
              Retake Quiz
            </Button>
          </div>
          <div>
            <Button
              onClick={async () => {
                await upsertQuizCompleted(userQuiz.userQuizProgressId, false);
                window.location.href = "/wordList/" + wordsListId;
              }}
            >
              {" "}
              Reset Quiz and Back to Dashboard
            </Button>
          </div>
          <div>
          {/* TODO: Fix the back to dashboard */}
          <Button
              onClick={async () => {
                window.location.href = "/wordList/" + wordsListId;
              }}
            >
              {" "}
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
