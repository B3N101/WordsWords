import WordListPage from "@/components/wordList/wordListPage";
import { Suspense } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const wordListString = params.slug;

  return (
    <div>
      <h1>WordList page for {wordListString}</h1>
      {/* Add your class page content here */}
      <Suspense>
        <WordListPage wordListID={wordListString} />
      </Suspense>
    </div>
  );
}
