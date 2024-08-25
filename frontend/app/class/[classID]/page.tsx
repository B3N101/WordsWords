import StudentClassPage from "@/components/class/studentClassPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | Class",
  description: "MX Words Words Class Page",
};

export default async function Page({
  params,
}: {
  params: { classID: string };
}) {
  const classString = params.classID;

  return (
    <div>
      <StudentClassPage classID={classString} />
    </div>
  );
}
