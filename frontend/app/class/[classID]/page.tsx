import ClassPage from "@/components/class/classPage";
import StudentClassPage from "@/components/class/studentClassPage"
import { CheckboxReactHookFormMultiple } from "@/components/wordList/formTest";

export default async function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID;

  return (
    <div>
      {/* Add your class page content here */}
      <StudentClassPage classID={classString} />
    </div>
  );
}
