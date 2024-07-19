import { getClass, getWordList, getWordListWords } from "@/prisma/queries";
import ClassCard from "@/components/classCard";
import { List }from "./list";

export default async function Home() {
    const classID = await getClass("4b184fac-5693-42cd-8ecd-13c2fab16f33");
    const wordLists = await getWordList(classID!);
    const words = await getWordListWords(wordLists![0].listId);
    return (
        <div className="h-full flex-1 items-center justify-center">
            <div>
                <ClassCard title="Demo Class" description="This is a demo class for testing purposes"/>
                <p className="text-green-600 font-extrabold text-xl">Home</p>
                <p> ClassID is </p>
                <p>{JSON.stringify(classID)}</p>
                <p> WordLists are:</p>
                <p>{JSON.stringify(wordLists)}</p>
                <p> Words are:</p>
                <p>{JSON.stringify(words)}</p>
            </div>
        </div>
    );
}