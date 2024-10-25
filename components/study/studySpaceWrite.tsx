"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import ProgressBar from "@/components/progressBar";
import {
  updateStudySpaceWord,
  updateStudySpaceQuestionCompleted,
  updateStudyQuizCompleted,
} from "@/actions/study_space";
import { stringSimilarity } from "string-similarity-js"
import { type StudyQuizWithQuestions } from "@/prisma/types";
type Props = {
  quiz: StudyQuizWithQuestions;
  classID: string;
};
import AudioButton from "../audioButton";

export default function StudyWritePage({ quiz, classID }: Props) {
  const questions = quiz.questions;
  const studySpaceID = quiz.studySpaceID;
  // sort questions by their rank attribute:
  questions.sort((a, b) => a.rank - b.rank);
  const words = questions.map((question) => question.studyWord.word);

  // TODO: shuffle questions here
  const [completed, setCompleted] = useState<boolean>(quiz.completed);
  const [selected, setSelected] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
  const [isCorrect, setIsCorrect] = useState<boolean>(
    false,
  );
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(
    questions[currentIndex].studyWord.starred,
  );
  const [isStarButtonDisabled, setIsStarButtonDisabled] =
    useState<boolean>(false);
  const [isUpserted, setIsUpserted] = useState<boolean>(false);

  // states for the definition form
  const [answer, setAnswer] = useState<string>("");
  const question = questions[currentIndex];
  const word = question.studyWord.word;

  const handleStarClick = async (wordID: string) => {
    setIsStarButtonDisabled(true);
    setIsStarred(!isStarred);
    if (isStarred) {
      //unstar
      await updateStudySpaceWord(studySpaceID, wordID, false);
    } else {
      //star
      await updateStudySpaceWord(studySpaceID, wordID, true);
    }
    setIsStarButtonDisabled(false);
    return;
  };
  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const definitions = word.definition.split(";").map((definition) => definition.trim());
    definitions.push(word.definition);
    let thisIsCorrect: boolean = false;
    console.log(definitions);
    for (let i = 0; i < definitions.length; i++) {
      const sim1 = stringSimilarity(answer, definitions[i], 1);
      const sim2 = stringSimilarity(answer, definitions[i]);

      console.log("String length is ", definitions[i].length);
      console.log(sim1, sim2);

      if (sim2 > .75 || sim1 > .8) {
        setIsCorrect(true);
        setScore(score + 1);
        thisIsCorrect = true;
        break;
      }

    }
    if(!thisIsCorrect){
      setIsCorrect(false);
    }
    await updateStudySpaceQuestionCompleted(question.id, true, isCorrect);
    await updateStudySpaceWord(studySpaceID, word.wordId, !isCorrect);
    setAnswerSubmitted(true);
  return;
}
// TODO: Update score, add additional parameter for was original correct
const handleNextClick = async (manualIsCorrect: boolean, updating: boolean ) => {
  setIsButtonDisabled(true);
  if (manualIsCorrect){
    setIsStarred(false);
  }
  else{
    setIsStarred(true);
  }
  if (updating){
    await updateStudySpaceQuestionCompleted(question.id, true, manualIsCorrect);
    await updateStudySpaceWord(studySpaceID, word.wordId, !manualIsCorrect);
    if (manualIsCorrect !== isCorrect){
      if (manualIsCorrect){
        setScore(score + 1);
      }
      else{
        setScore(score - 1);
      }
    }
  }
  if(currentIndex + 1 < questions.length){
    setCurrentIndex(currentIndex + 1);
    setIsCorrect(false);
    setIsStarred(questions[currentIndex].studyWord.starred);
  }
  else{
    await updateStudyQuizCompleted(quiz.id, true, score);
    setIsUpserted(true);
    setCompleted(true);
  }
  setIsButtonDisabled(false);
  setAnswerSubmitted(false);
  setAnswer("");
}
  return (
    <div>
      {!completed ? (
        <div className="flex flex-col gap-10 h-[90dvh] relative">
          <header className="pb-10 pt-10 flex-col items-center align-middle">
            <ProgressBar
              value={((currentIndex + 1) / questions.length) * 100}
            />
            <div className="text-center pt-5">
              Card {currentIndex + 1} / {questions.length}
            </div>
          </header>
          <h1 className="flex flex-row gap-3 text-5xl font-bold items-center text-center mx-auto">
            <Button
              onClick={() => handleStarClick(words[currentIndex].wordId)}
              disabled={isStarButtonDisabled}
            >
              {isStarred ? (
                <Star className="h-4 w-4" fill="black" strokeWidth={0} />
              ) : (
                <Star className="h-4 w-4" />
              )}
            </Button>

            {words[currentIndex].word}
            {words[currentIndex].audioSrc ? (
              <AudioButton src={words[currentIndex].audioSrc} />
            ) : null}
          </h1>
          <main className="flex justify-center flex-1 align-middle h-dvh flex-col">
        <form onSubmit={handleAnswerSubmit} className="w-3/4 mx-auto mt-8 gap-2 space-y-2">
        <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={!answerSubmitted ? "border p-2 w-full" : isCorrect ? "border p-2 w-full outline outline-green-500" : "border p-2 w-full outline outline-red-500"}
            placeholder="Enter your definition"
            disabled={answerSubmitted}
        />
        <Button
            type="submit"            
            disabled={answerSubmitted}
        >
            Submit
        </Button>
        </form>
        {answerSubmitted && (
        <div className="mt-3 text-lg font-semibold px-5">
          {isCorrect ? "Correct!" : "Incorrect"}
          <p className="py-2 font-normal">
            {word.definition}
          </p>
            <div className="flex flex-col mt-3">
              
            <div className="flex space-x-4 py-2">
              {!isCorrect ? (
                <Button
                onClick={() => handleNextClick(true, true)}
                disabled={
                  isButtonDisabled
                }
                variant="correct"
              >
                Override: I was correct
              </Button>
              ):
              (<Button
                onClick={() => handleNextClick(false, true)}
                disabled={
                  isButtonDisabled
                }
                variant="incorrect"
              >
                Override: I was wrong
              </Button>)
              }
              
              <Button
                onClick={() => handleNextClick(isCorrect, false)}
                disabled={
                  isButtonDisabled
                }
                className="flex absolute right-9 mx-auto"
              >
                Next
              </Button>
            </div>
        </div>
        </div>
        )}
      </main>
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-10 align-middle">
          <h1 className="text-3xl font-bold pt-10">Quiz Results</h1>
          <p>
            You scored {score === 0 ? quiz.score : score} out of{" "}
            {questions.length}
          </p>
          <div className="grid grid-cols-1 gap-6 m-12">
            <Button
              onClick={async () => {
                if (!isUpserted) {
                  await updateStudyQuizCompleted(quiz.id, true, score);
                }
                window.location.href = "/class/" + classID + "/study";
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

