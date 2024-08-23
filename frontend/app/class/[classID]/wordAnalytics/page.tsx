import { WordAnalytics } from "@/components/analytics/wordAnalytics";
import { Suspense } from "react";

export default function Page({ params }: { params: { classID: string } }) {
  return (
    <div>
      <Suspense>
        <WordAnalytics classID={params.classID} />
      </Suspense>
    </div>
  );
}
