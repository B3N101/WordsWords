import { WordAnalytics } from "@/components/analytics/wordAnalytics";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Word Analytics",
  description: "MX Words Words Word Analytics Page",
};

export default function Page({ params }: { params: { classID: string } }) {
  return (
    <div>
      <Suspense>
        <WordAnalytics classID={params.classID} />
      </Suspense>
    </div>
  );
}
