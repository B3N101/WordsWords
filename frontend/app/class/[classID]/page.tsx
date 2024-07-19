import ClassPage from "@/components/classPage";

export default function Page({ params }: { params: { classID: string } }) {
  const classString = params.classID;

  return (
    <div>
      <h1>Class Page for {classString}</h1>
      {/* Add your class page content here */}
        <ClassPage classID={classString} />
    </div>
  );
}
