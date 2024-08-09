"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import {
  upsertQuestionCompleted,
  upsertQuizCompleted,
} from "@/actions/quiz_progress";

import {
  createMiniQuiz,
} from "@/actions/quiz_creation";

import { upsertWordMastery } from "@/actions/word_progress";
import { type QuizWithQuestions } from "@/prisma/types";
type Props = {
  quiz: QuizWithQuestions;
};

export default function QuizPage({ quiz }: Props) {
  const questions = quiz.questions;  
  // TODO: shuffle questions here
  const [completed, setCompleted] = useState<boolean>(quiz.completed);
  const [selected, setSelected] = useState<string|null>(null);
  const [started, setStarted] = useState<boolean>(() => {
    return questions.some((question) => question.completed);
  });
  // return the first uncompleted question
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const uncompletedIndex = questions.findIndex(
      (question) => !question.completed,
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [score, setScore] = useState<number>(0);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(
    null,
  );
  const [questionSubmitted, setQuestionSubmitted] = useState<boolean>(false);
  if (!quiz.learnCompleted && quiz.quizType === "MINI"){
    return (
      <div>
        key={0}
        <div>      
          Learn Mode not Completed Yet!
        </div>
        <Link
          className="flex items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-4"
          href={`/learn/${quiz.quizId}`}
        >
          <div>Go to Learn</div>
        </Link>
      </div>)
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
      if (isCurrentCorrect)
      {
        setScore(score+1);
      }
      upsertQuestionCompleted(
        questions[currentIndex].questionId,
        true,
      );
      upsertWordMastery(question.wordId, isCurrentCorrect!);

      setQuestionSubmitted(true);
    }
    // user has just pressed next
    else{
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setQuestionSubmitted(false);
        setSelected(null);
        setIsCurrentCorrect(null);
      }
      else{
        await upsertQuizCompleted(quiz.quizId, true, score);
        setCompleted(true);
        return;
      }
    }
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
                <h2 className="text-2xl font-bold">{question.questionString}</h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {options.map((answer, index) => (
                    <Button
                      key={index}
                      variant={ 
                        questionSubmitted ? (selected === answer ? (isCurrentCorrect ? "correct" : "incorrect") : (answer === question.correctAnswer? "correct" : "answer_selected")) 
                        : (selected === answer ? "answer_selected" : "answer_choice")
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
          <footer className="flow-root pb-9 px-6 bottom mb-0 items-center justify-center">
            {
              questionSubmitted ? (
              <div className="flex flex-col">
                {isCurrentCorrect ? ("Correct!") : ("Incorrect!")}
              </div>
            ) : null
            }
            <div className="float-right flex flex-col">
              <Button onClick={handleNext} disabled={started ? selected===null : false}>
                {!started
                  ? "Start"
                  : questionSubmitted ? 
                    "Next"
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
                const newQuizData = createMiniQuiz(quiz.wordsListId, quiz.userId, quiz.miniSetNumber, true);
                // TODO: switch to updating react states, remove async
                <div> Loading ... </div>
                console.log("Making new quiz")
                newQuizData.then((newQuiz) => {
                  if (newQuiz) {
                    window.location.href = "/quiz/" + newQuiz.quizId;
                  }
                });
              }}
            >
              {" "}
              Retake Quiz
            </Button>
          </div>
          <div>
          <Button
              onClick={async () => {
                window.location.href = "/wordList/" + quiz.wordsListId;
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