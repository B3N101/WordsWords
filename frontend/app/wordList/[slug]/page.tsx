import WordListPage from "@/components/wordList/wordListPage";
import { Suspense } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const wordListString = params.slug;
  console.log("Redering wordlist page for", wordListString);
  return (
    <div>
      {/* Add your class page content here */}
      <Suspense>
        <WordListPage wordListID={wordListString} />
      </Suspense>
    </div>
  );
}
