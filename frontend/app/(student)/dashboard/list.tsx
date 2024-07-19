"use client";
import ClassCard from "@/components/classCard";
import { Card } from "@/components/ui/card";
type Props = {
    studentID: string;
    classID: string;
}

export const List = ({studentID, classID}: Props) => {
    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px),1fr)] gap-4">
            List
            <Card
                key={classID}
                id={classID}
                title="Demo Class"
                onClick={() => {console.log("clicked")}}
        />
        </div>

    )
}