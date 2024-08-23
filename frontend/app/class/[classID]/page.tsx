import StudentClassPage from "@/components/class/studentClassPage";

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
