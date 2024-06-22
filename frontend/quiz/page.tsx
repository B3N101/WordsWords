'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
type Question = {
  question: string;
  options: string[];
  answer: string;
};

const quizQuestions: Question[] = [
  {
    question: "What is the definition of \"dog\"?",
    options: ["Animal with four legs", "Man's best friend", "Something that can bark", "A living organism with fur"],
    answer: "Man's best friend",
  },
  {
    question: "Which Middlesex boys dorm is the best?",
    options: ["Landry", "Atkins", "RW", "Clay"],
    answer: "Atkins",
  },
  {
    question: "How many hours of sleep do MX students average every night?",
    options: ["6", "7", "8", "9"],
    answer: "7",
  },
];

export default function Quiz() {
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
          <h2 className="h-full items-center justify-center text-lg">{quizQuestions[currentQuestion].question}</h2>
          <div>
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(option)}
                variant="default"
              >
                {option}
              </Button>
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
  );
}
