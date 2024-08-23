import { WordAnalytics } from "@/components/analytics/wordAnalytics";
import WordAnalyticSkeleton  from "@/components/analytics/skeleton";
import { Suspense } from "react";

export default function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID
  console.log("Class is ", classString);
  return (
    <div>
      <Suspense fallback={<WordAnalyticSkeleton/>}>
        <WordAnalytics classID={classString}/>
      </Suspense>
    </div>
  );
}
