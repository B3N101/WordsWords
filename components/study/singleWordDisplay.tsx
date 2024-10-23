"use client";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateStudySpaceWord } from "@/actions/study_space";
import { useState } from "react";
import { StudySpaceWordWithWord } from "@/prisma/types";
function StarFilled() {
  return <Star className="h-4 w-4" fill="black" strokeWidth={0} />;
}
type StarButtonProps = {
  studyWord: StudySpaceWordWithWord;
  starred: boolean;
  setStarred: (word: StudySpaceWordWithWord) => void;
  setUnstarred: (word: StudySpaceWordWithWord) => void;
};
export default function SingleWordDisplay({
  studyWord,
  starred,
  setStarred,
  setUnstarred,
}: StarButtonProps) {
  const [isStarred, setIsStarred] = useState<boolean>(starred);
  const handleStarClick = (starred: boolean) => {
    if (starred) {
      //unstar
      updateStudySpaceWord(studyWord.studySpaceID, studyWord.wordID, false);
      setUnstarred(studyWord);

      setIsStarred(false);
    } else {
      //star
      updateStudySpaceWord(studyWord.studySpaceID, studyWord.wordID, true);
      setStarred(studyWord);
      setIsStarred(true);
    }
  };
  return (
    <div className="flex group items-center justify-between border-2 border-[#ff6b6b] rounded-lg p-2">
      <div className="text-lg text-gray-600 font-semibold">
        {studyWord.word.word}
      </div>
      <div className="text-sm text-gray-600 m-auto">
        {studyWord.word.definition}
      </div>

      <Button
        variant="outline"
        onClick={() => handleStarClick(isStarred)}
        className="ml-auto float-right"
      >
        {isStarred ? <StarFilled /> : <Star className="h-4 w-4" />}
      </Button>
    </div>
  );
}
export function StarButton({ studyWord, starred }: StarButtonProps) {
  const [isStarred, setIsStarred] = useState<boolean>(starred);
  const handleStarClick = (starred: boolean) => {
    if (starred) {
      //unstar
      updateStudySpaceWord(studyWord.studySpaceID, studyWord.wordID, false);
      setIsStarred(false);
    } else {
      //star
      updateStudySpaceWord(studyWord.studySpaceID, studyWord.wordID, true);
      setIsStarred(true);
    }
  };
  return (
    <Button
      variant="outline"
      onClick={() => handleStarClick(isStarred)}
      className="ml-auto float-right"
    >
      {isStarred ? <StarFilled /> : <Star className="h-4 w-4" />}
    </Button>
  );
}
