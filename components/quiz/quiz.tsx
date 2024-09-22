"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import {
  upsertQuestionCompleted,
  upsertQuizCompleted,
} from "@/actions/quiz_progress";

import { createMasterQuiz, createMiniQuiz } from "@/actions/quiz_creation";

import {
  upsertWordMastery,
  updateWordListProgress,
} from "@/actions/word_progress";
import { type QuizWithQuestionsAndUserWordsList } from "@/prisma/types";
type Props = {
  quiz: QuizWithQuestionsAndUserWordsList;
  userID: string;
};

export default function QuizPage({ quiz, userID }: Props) {
  const questions = quiz.questions;
  // sort questions by their rank attribute:
  questions.sort((a, b) => a.rank - b.rank);
  const classId = quiz.userWordsListProgress.classId;
  const wordListId = quiz.wordsListId;
  // TODO: shuffle questions here
  const [completed, setCompleted] = useState<boolean>(quiz.completed);
  const [selected, setSelected] = useState<string | null>(null);
  const [started, setStarted] = useState<boolean>(() => {
    return questions.some((question) => question.completed);
  });
  // return the first uncompleted question
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const uncompletedIndex = questions.findIndex(
      (question) => !question.completed,
    );
    if (uncompletedIndex === -1) {
      setCompleted(true);
      return 0;
    }
    return uncompletedIndex;
  });
  const [score, setScore] = useState<number>(() => {
    let score = 0;
    questions.forEach((question) => {
      if (question.correctlyAnswered) {
        score++;
      }
    });
    return score;
  });
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(
    null,
  );
  const [questionSubmitted, setQuestionSubmitted] = useState<boolean>(false);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [isLoadingNewQuiz, setIsLoadingNewQuiz] = useState<boolean>(false);
  const [isUpserted, setIsUpserted] = useState<boolean>(false);

  if (!quiz.learnCompleted && quiz.quizType === "MINI") {
    return (
      <div>
        key={0}
        <div>Learn Mode not Completed Yet!</div>
        <Link
          className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
          href={`/learn/${quiz.quizId}`}
        >
          <div>Go to Learn</div>
        </Link>
      </div>
    );
  }
  const question = questions[currentIndex];
  const options = question.allAnswers;
  /*TODO: Track user progress so that refresh sends them to the current answer*/
  const handleAnswerClick = (answer: String) => {
    setIsCurrentCorrect(answer === question.correctAnswer);
    setSelected(String(answer));
  };

  const handleNext = async () => {
    // start the quiz
    if (!started) {
      setStarted(true);
      return;
    }
    // make sure an answer is selected
    if (selected === null) {
      return;
    }
    // the user has just submitted an answer
    if (!questionSubmitted) {
      let answeredCorrectly = isCurrentCorrect ? true : false;

      if (isCurrentCorrect) {
        setScore(score + 1);
      }
      console.log(score);
      await upsertQuestionCompleted(
        questions[currentIndex].questionId,
        true,
        answeredCorrectly,
      );
      upsertWordMastery(
        question.wordId,
        isCurrentCorrect!,
        wordListId,
        quiz.quizType,
      );

      setQuestionSubmitted(true);
    }
    // user has just pressed next
    else {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setQuestionSubmitted(false);
        setSelected(null);
        setIsCurrentCorrect(null);
      } else {
        setIsLoadingResults(true);
        await upsertQuizCompleted(quiz.quizId, true, score);
        setIsUpserted(true);
        if (quiz.quizType === "MASTERY") {
          if (score >= questions.length * 0.8) {
            await updateWordListProgress(wordListId, userID, true);
          }
        }
        setCompleted(true);
        setIsLoadingResults(false);
        return;
      }
    }
  };
  return (
    <div>
      {isLoadingResults || isLoadingNewQuiz ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
            {isLoadingNewQuiz
              ? "Creating New Quiz ..."
              : "Compiling Results ..."}
          </p>
        </div>
      ) : !completed ? (
        <div className="flex flex-col">
          {started ? (
            <header className="pb-10 pt-10 flex-col items-center align-middle">
              <ProgressBar
                value={((currentIndex + 1) / questions.length) * 100}
              />
              <div className="text-center pt-5">
                Question {currentIndex + 1} / {questions.length}
              </div>
            </header>
          ) : null}
          <main className="flex justify-center flex-1 align-middle h-dvh">
            {!started ? (
              <h1 className="text-3xl font-bold p-4 pt-10">{quiz.name}</h1>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-center w-3/4 mx-auto">
                  {question.questionString}
                </h2>
                <div className="grid grid-cols1 gap-6 m-12 max-w-[100%] items-center justify-center">
                  {options.map((answer, index) => (
                    <Button
                      key={index}
                      variant={
                        questionSubmitted
                          ? selected === answer
                            ? isCurrentCorrect
                              ? "correct"
                              : "incorrect"
                            : answer === question.correctAnswer
                              ? "correct"
                              : "answer_selected"
                          : selected === answer
                            ? "answer_selected"
                            : "answer_choice"
                      }
                      onClick={() => handleAnswerClick(answer)}
                      disabled={questionSubmitted}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </main>
          <footer
            className={
              started
                ? "flow-root px-6 mb-0 items-center justify-center"
                : "flow-root px-6 mb-0 position absolute bottom-10 right-2 items-center justify-center"
            }
          >
            {questionSubmitted ? (
              <div className="float-left">
                {isCurrentCorrect ? "Correct!" : "Incorrect!"}
              </div>
            ) : null}
            <div className="float-right">
              <Button
                onClick={handleNext}
                disabled={started ? selected === null : false}
              >
                {!started ? "Start" : questionSubmitted ? "Next" : "Submit"}
              </Button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-10 align-middle">
          <h1 className="text-3xl font-bold pt-10">Quiz Results</h1>
          <p>
            You scored {score === 0 ? quiz.score : score} out of{" "}
            {questions.length}
          </p>
          <div className="grid grid-cols-2 gap-6 m-12">
            <Button
              onClick={async () => {
                setIsLoadingNewQuiz(true);
                if (quiz.quizType === "MINI") {
                  const newQuiz = await createMiniQuiz(
                    quiz.wordsListId,
                    quiz.userId,
                    classId,
                    quiz.miniSetNumber,
                    true,
                  );
                  if (!newQuiz) {
                    throw new Error("Error creating new quiz");
                  }
                  window.location.href = "/quiz/" + newQuiz.quizId;
                } else {
                  const newQuiz = await createMasterQuiz(
                    quiz.wordsListId,
                    quiz.userId,
                    classId,
                  );
                  if (!newQuiz) {
                    throw new Error("Error creating new quiz");
                  }
                  window.location.href = "/quiz/" + newQuiz.quizId;
                }
              }}
            >
              Retake Quiz
            </Button>
            <Button
              onClick={async () => {
                if (!isUpserted){
                  await upsertQuizCompleted(quiz.quizId, true, score);
                }
                window.location.href =
                  "/class/" + classId + "/" + quiz.wordsListId;
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