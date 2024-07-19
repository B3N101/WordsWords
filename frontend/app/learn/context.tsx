"use client";

import { type Word } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { upsertLearnCompleted } from "@/actions/quiz_progress";
type Props = {
    words: Word[]
    quizId: string
}
export default function ContextPage({ words, quizId }: Props){
    const [onContext, setOnContext] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);
    const handleNext = () => {

        if (onContext){
            setOnContext(false);
            return;
        }
        else{
            setOnContext(true);
            if(currentIndex + 1 < words.length){
                setCurrentIndex(currentIndex + 1);
            }
            else{
                setCompleted(true);
            }
        }
    }

    const handleBack = () => {
        if (!onContext){
            setOnContext(true);
            return;
        }
        else{
            if(currentIndex - 1 >= 0){
                setCurrentIndex(currentIndex - 1);
            }
        }
    }
    return (
    <div>
        {!completed ? <div>
            <h1 className="text-5xl font-extrabold">{words[currentIndex].word}</h1>
            <p>
                {onContext ? 
                words[currentIndex].context :
                words[currentIndex].definition}
            </p>
            <footer className="lg:-h[140px] h-[100px] border-t-2 flow-root pb-9 px-6 bottom mb-0">
            <div className="float-right flex flex-col">
              <Button onClick={handleNext}>
                {onContext
                  ? "See Definition"
                  : currentIndex !== words.length - 1
                    ? "Next"
                    : "End Learning"}
              </Button>
            </div>
            <div className="float-left flex flex-col">
                {(currentIndex >= 1 || !onContext) ?
                    <Button onClick={handleBack}>
                        {onContext
                            ? "Back"
                            : "Back to Context"}
                    </Button>
                : null
                }
            </div>
          </footer>
        </div>:
        <div>
            <h1 className="text-5xl font-extrabold">You've completed learning!</h1>
            <footer className="lg:-h[140px] h-[100px] border-t-2 flow-root pb-9 px-6 bottom mb-0">
            <div className="float-right flex flex-col">
              <Button onClick={async () => {
                await upsertLearnCompleted(quizId, true);
                window.location.href = `/quiz/${quizId}`;
                }}>
                Go to Quiz
              </Button>
            </div>
            <div className="float-left flex flex-col">
                <Button onClick={async () => {
                    await upsertLearnCompleted(quizId, true);
                    window.location.href = `/quiz`;
                    }}>
                    Back to dashboard
                </Button>
            </div>
          </footer>
        </div>
        }
    </div>
    )
}