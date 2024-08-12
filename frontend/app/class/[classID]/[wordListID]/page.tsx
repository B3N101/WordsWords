import WordListPage from "@/components/wordList/wordListPage";
import { Suspense } from "react";

export default function Page({ params }: { params: { classID: string, wordListID: string } }) {
  const classString = params.classID
  const wordListString = params.wordListID;
  console.log("Redering wordlist page for", wordListString);
  console.log("Class is ", classString);
  return (
    <div>
      {/* Add your class page content here */}
      <Suspense>
        <WordListPage classID={classString} wordListID={wordListString}/>
      </Suspense>
    </div>
  );
}
