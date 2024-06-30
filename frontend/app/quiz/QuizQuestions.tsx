"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";

export type answer = {
  answerText: string;
  isCorrect: boolean;
  id: number;
};
export type question = {
  questionText: string;
  answers: answer[];
};
export type Quiz = {
  questions: question[];
};
export default function QuizQuestions(props: Quiz) {
  const { questions } = props;
  // const quizQuestions = await getWordList();

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(
    null,
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAnswerClick = (answer: answer) => {
    setSelectedAnswer(answer.id);
    setIsCurrentCorrect(answer.isCorrect);
  };
  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
    console.log(isCurrentCorrect);
    console.log(score);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }

    setSelectedAnswer(null);
    setIsCurrentCorrect(null);
  };
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setSelectedAnswer(null);
    setIsCurrentCorrect(null);
  };
  return (
    <div>
      {!submitted ? (
        <div className="flex flex-col flex-1">
          <div>
            <header>
              <ProgressBar value={(currentQuestion / questions.length) * 100} />
            </header>
          </div>
          <main className="flex justify-center flex-1">
            {!started ? (
              <h1 className="text-3xl font-bol">Demo Words Quiz</h1>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">
                  {questions[currentQuestion].questionText}
                </h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {questions[currentQuestion].answers.map((answer) => (
                    <Button
                      key={answer.id}
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
            <div className="float-left flex flex-col">
              {!started ? null : <Button onClick={handleBack}>{"Back"}</Button>}
            </div>
            <div className="float-right flex flex-col">
              <p>{isCurrentCorrect ? "correct" : "incorrect"}</p>
              <Button onClick={handleNext}>
                {!started
                  ? "Start"
                  : currentQuestion !== questions.length - 1
                    ? "Next"
                    : "Submit"}{" "}
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
