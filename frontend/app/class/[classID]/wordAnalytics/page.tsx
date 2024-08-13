import { WordAnalytics } from "@/components/analytics/wordAnalytics";
import { Suspense } from "react";

export default function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID
  console.log("Class is ", classString);
  return (
    <div>
      {/* Add your class page content here */}
      <Suspense>
        <WordAnalytics classID={classString}/>
      </Suspense>
    </div>
  );
}
