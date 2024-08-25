import { PeopleBoard } from "@/components/class/people";
import { PeopleSkeleton } from "@/components/class/skeleton";
import { Suspense } from "react";

export default function Page({ params }: { params: { classID: string } }) {
    const classString = params.classID
    return (
      <div>
        <Suspense fallback={<PeopleSkeleton/>}>
          <PeopleBoard classID={classString}/>
        </Suspense>
      </div>
    );
  }
  