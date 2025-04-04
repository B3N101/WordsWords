"use client";
import { StudySpaceWithLists, StudySpaceWordWithWord } from "@/prisma/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import SingleWordDisplay from "./singleWordDisplay";
import { Button } from "../ui/button";
import {
  createFlashCardQuiz,
  createStudyQuiz,
  createWriteQuiz,
  deleteStudySpace,
} from "@/actions/study_space";
import { useState } from "react";
type StudyInterfaceProps = {
  studySpace: StudySpaceWithLists;
};
export default function StudyInterface({ studySpace }: StudyInterfaceProps) {
  const [starredWords, setStarredWords] = useState<StudySpaceWordWithWord[]>(
    studySpace.StudySpaceWords.filter((word) => word.starred),
  );
  const [unstarredWords, setUnstarredWords] = useState<
    StudySpaceWordWithWord[]
  >(studySpace.StudySpaceWords.filter((word) => !word.starred));
  //   const starredWords = studySpace.StudySpaceWords.filter(
  //     (word) => word.starred,
  //   );
  //   const unstarredWords = studySpace.StudySpaceWords.filter(
  //     (word) => !word.starred,
  //   );
  const starWord = (word: StudySpaceWordWithWord) => {
    setStarredWords([...starredWords, word]);
    setUnstarredWords(unstarredWords.filter((w) => w !== word));
  };
  const unstarWord = (word: StudySpaceWordWithWord) => {
    setUnstarredWords([...unstarredWords, word]);
    setStarredWords(starredWords.filter((w) => w !== word));
  };
  const allWords = [...starredWords, ...unstarredWords];
  const studySpaceQuizzes = studySpace.StudySpaceQuizzes;
  let listString = "";
  for (let i = 0; i < studySpace.wordLists.length; i++) {
    listString += studySpace.wordLists[i].name;
    if (i < studySpace.wordLists.length - 1) {
      listString += ", ";
    }
  }
  return (
    <div className="flex-1 p-6 gap-y-5">
      <div className="flex items-center justify-between m-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#ff6b6b]">Study Space</h1>
          <div className="text-left w-full">{listString}</div>
        </div>
        <DeleteButton studySpace={studySpace} />
      </div>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">Starred Words</h2>
            {starredWords.length > 0 ? (
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Flashcard Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Learn With Flashcards</DialogHeader>
                    <FlashcardSelectionButtons
                      studySpace={studySpace}
                      words={starredWords}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Quiz Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Start Quizzing</DialogHeader>
                    <QuizSelectionButtons
                      studySpace={studySpace}
                      words={starredWords}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Write Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Enter Write Mode</DialogHeader>
                    <WriteSelectionButtons
                      studySpace={studySpace}
                      words={starredWords}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : null}
          </div>
          <div className="space-y-4 py-5">
            {starredWords.map((word) => (
              <SingleWordDisplay
                studyWord={word}
                starred={true}
                key={word.wordID}
                setStarred={starWord}
                setUnstarred={unstarWord}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">Unstarred Words</h2>
            {unstarredWords.length > 0 ? (
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Flashcard Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Learn With Flashcards</DialogHeader>
                    <FlashcardSelectionButtons
                      studySpace={studySpace}
                      words={unstarredWords}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Quiz Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Start Quizzing</DialogHeader>
                    <QuizSelectionButtons
                      studySpace={studySpace}
                      words={unstarredWords}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Write Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Enter Write Mode</DialogHeader>
                    <WriteSelectionButtons
                      studySpace={studySpace}
                      words={unstarredWords}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : null}
          </div>
          <div className="space-y-4 py-5">
            {unstarredWords.map((word) => {
              const thisWordStarred = starredWords.includes(word);
              return (
                <SingleWordDisplay
                  studyWord={word}
                  starred={thisWordStarred}
                  key={word.wordID}
                  setStarred={starWord}
                  setUnstarred={unstarWord}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-lg shadow-md my-10">
        <CardContent>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl text-[#ff6b6b]">All Words</h2>
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                    Flashcard Mode
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Learn With Flashcards</DialogHeader>
                  <FlashcardSelectionButtons
                    studySpace={studySpace}
                    words={allWords}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                    Quiz Mode
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Start Quizzing</DialogHeader>
                  <QuizSelectionButtons
                    studySpace={studySpace}
                    words={allWords}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#ff6b6b] text-white hover:bg-[#ff6b6baf] font-bold py-2 px-4 rounded-lg border-red-300 border-2">
                      Write Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Enter Write Mode</DialogHeader>
                    <WriteSelectionButtons
                      studySpace={studySpace}
                      words={allWords}
                    />
                  </DialogContent>
                </Dialog>
            </div>
          </div>
          <div className="space-y-4 py-5">
            {allWords.map((word) => (
              <SingleWordDisplay
                studyWord={word}
                starred={word.starred}
                key={word.wordID}
                setStarred={starWord}
                setUnstarred={unstarWord}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function DeleteButton({ studySpace }: { studySpace: StudySpaceWithLists }) {
  async function deleteSpace() {
    await deleteStudySpace(studySpace.id);
    window.location.reload();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Reset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-lg font-bold">
          Delete Current Space
        </DialogHeader>
        This action cannot be undone. Are you sure?
        <Button variant="destructive" onClick={() => deleteSpace()}>
          Delete Study Space
        </Button>
      </DialogContent>
    </Dialog>
  );
}
function QuizSelectionButtons({
  studySpace,
  words,
}: {
  studySpace: StudySpaceWithLists;
  words: StudySpaceWordWithWord[];
}) {
  async function getNewQuiz() {
    await createStudyQuiz(studySpace.id, words);
    window.location.href = `study/${studySpace.id}/quiz/`;
  }
  if (!studySpace.StudySpaceQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewQuiz()}
      >
        Start New Quiz
      </Button>
    );
  }
  const oldQuizzes = studySpace.StudySpaceQuizzes.filter(
    (quiz) => quiz.studyType === "QUIZ",
  );
  if (!oldQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewQuiz()}
      >
        Start New Quiz
      </Button>
    );
  }
  const oldQuiz = oldQuizzes[0];

  if (oldQuiz && !oldQuiz.completed && oldQuiz.length > 0) {
    return (
      <div className="flex flex-row justify-between">
        <Link href={`study/${studySpace.id}/quiz/`} passHref>
          <button className="bg-[#ff6b6b] text-white font-bold py-2 px-4 rounded-lg">
            Continue Previous Session
          </button>
        </Link>
        <Button
          className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
          onClick={() => getNewQuiz()}
        >
          Start New Quiz
        </Button>
      </div>
    );
  } else {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewQuiz()}
      >
        Start New Quiz
      </Button>
    );
  }
}

function FlashcardSelectionButtons({
  studySpace,
  words,
}: {
  studySpace: StudySpaceWithLists;
  words: StudySpaceWordWithWord[];
}) {
  async function getNewFlashcards() {
    await createFlashCardQuiz(studySpace.id, words);
    window.location.href = `study/${studySpace.id}/flashcard/`;
  }

  if (!studySpace.StudySpaceQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewFlashcards()}
      >
        Start New Flashcards
      </Button>
    );
  }
  const oldQuizzes = studySpace.StudySpaceQuizzes.filter(
    (quiz) => quiz.studyType === "FLASHCARD",
  );
  if (!oldQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewFlashcards()}
      >
        Start New Flashcards
      </Button>
    );
  }
  const oldQuiz = oldQuizzes[0];

  if (oldQuiz && !oldQuiz.completed && oldQuiz.length > 0) {
    return (
      <div className="flex flex-row justify-between">
        <Link href={`study/${studySpace.id}/flashcard/`} passHref>
          <button className="bg-[#ff6b6b] text-white font-bold py-2 px-4 rounded-lg">
            Continue Previous Session
          </button>
        </Link>
        <Button
          className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
          onClick={() => getNewFlashcards()}
        >
          Start New Flashcards
        </Button>
      </div>
    );
  } else {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewFlashcards()}
      >
        Start New Flashcards
      </Button>
    );
  }
}


function WriteSelectionButtons({
  studySpace,
  words,
}: {
  studySpace: StudySpaceWithLists;
  words: StudySpaceWordWithWord[];
}) {
  async function getNewWriteQuiz() {
    await createWriteQuiz(studySpace.id, words);
    window.location.href = `study/${studySpace.id}/write/`;
  }

  if (!studySpace.StudySpaceQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewWriteQuiz()}
      >
        Start New Write
      </Button>
    );
  }
  const oldQuizzes = studySpace.StudySpaceQuizzes.filter(
    (quiz) => quiz.studyType === "WRITE",
  );
  if (!oldQuizzes) {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewWriteQuiz()}
      >
        Start New Write
      </Button>
    );
  }
  const oldQuiz = oldQuizzes[0];

  if (oldQuiz && !oldQuiz.completed && oldQuiz.length > 0) {
    return (
      <div className="flex flex-row justify-between">
        <Link href={`study/${studySpace.id}/write/`} passHref>
          <button className="bg-[#ff6b6b] text-white font-bold py-2 px-4 rounded-lg">
            Continue Previous Session
          </button>
        </Link>
        <Button
          className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
          onClick={() => getNewWriteQuiz()}
        >
          Start New Write
        </Button>
      </div>
    );
  } else {
    return (
      <Button
        className="bg-white text-[#ff6b6b] font-bold py-2 px-4 rounded-lg"
        onClick={() => getNewWriteQuiz()}
      >
        Start New Write
      </Button>
    );
  }
}
