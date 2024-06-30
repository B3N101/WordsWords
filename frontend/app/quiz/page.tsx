"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
type answer = {
  answerText: string;
  isCorrect: boolean;
  id: number;
};

const quizQuestions = [
  {
    question: 'What is the definition of "dog"?',
    answers: [
      { answerText: "Animal with four legs", isCorrect: false, id: 1 },
      { answerText: "Man's best friend", isCorrect: true, id: 2 },
      { answerText: "Something that barks", isCorrect: false, id: 3 },
      { answerText: "I don't know", isCorrect: false, id: 4 },
    ],
  },
  {
    question: "Which Middlesex boys dorm is the best?",
    answers: [
      { answerText: "Landry", isCorrect: false, id: 1 },
      { answerText: "Atkins", isCorrect: true, id: 2 },
      { answerText: "RW", isCorrect: false, id: 3 },
      { answerText: "Clay", isCorrect: false, id: 4 },
    ],
  },
  {
    question: "How many hours of sleep do MX students average every night?",
    answers: [
      { answerText: "6", isCorrect: false, id: 1 },
      { answerText: "7", isCorrect: true, id: 2 },
      { answerText: "8", isCorrect: false, id: 3 },
      { answerText: "9", isCorrect: false, id: 4 },
    ],
  },
];

export default function Quiz() {
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
    if (currentQuestion < quizQuestions.length - 1) {
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
              <ProgressBar
                value={(currentQuestion / quizQuestions.length) * 100}
              />
            </header>
          </div>
          <main className="flex justify-center flex-1">
            {!started ? (
              <h1 className="text-3xl font-bol">Demo Words Quiz</h1>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">
                  {quizQuestions[currentQuestion].question}
                </h2>
                <div className="grid grid-cols1 gap-6 m-12">
                  {quizQuestions[currentQuestion].answers.map((answer) => (
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
                  : currentQuestion !== quizQuestions.length - 1
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
            You scored {score} out of {quizQuestions.length}
          </p>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </div>
      )}
    </div>
  );
  /*
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleAnswerClick = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = (): number => {
    return userAnswers.filter((answer, index) => answer === quizQuestions[index].answer).length;
  };

  return (
    <div className="flex-w-full items-center justify-center font-bold ">
      {!showResults ? (
        <div>
          <h2 className="h-full  flex-column items-center justify-center text-lg">{quizQuestions[currentQuestion].question}</h2>
          <div>
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div>
              <Button
                key={index}
                onClick={() => handleAnswerClick(option)}
                variant="answer_choice"
              >
                {option}
              </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2>Your Score: {calculateScore()} / {quizQuestions.length}</h2>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </div>
      )}
    </div>
  );*/
}
