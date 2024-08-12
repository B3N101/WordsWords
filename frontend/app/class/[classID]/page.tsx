import ClassPage from "@/components/class/classPage";
import StudentClassPage from "@/components/class/studentClassPage"
export default function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID;

  return (
    <div>
      <h1>Class Page for {classString}</h1>
      {/* Add your class page content here */}
      <StudentClassPage classID={classString} />
    </div>
  );
}
