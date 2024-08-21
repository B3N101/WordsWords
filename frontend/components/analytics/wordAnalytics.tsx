import { getUserWordListsWithMasteries } from "@/prisma/queries";
import { Card, CardContent } from "@/components/ui/card";
import { auth }  from "@/auth/auth";
import { UserWordMastery } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Button,
} from "@/components/ui/button";

export async function WordAnalytics( { classID }: { classID: string} ) {
    const session = await auth();
    const userID = session?.user?.id!;
    const userWordLists = await getUserWordListsWithMasteries(userID, classID);
    return (
    <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#ff6b6b]">Word Analytics</h1>
            <AllStatus userWordMasteries={userWordLists.flatMap((userWordList) => userWordList.userWordMasteries)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {userWordLists.map((userWordList, i) => (
            userWordList.userWordMasteries.length > 0 ?
            (
            <Card className="bg-white rounded-lg shadow-md, max-h-fit" key={i}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#ff6b6b]">{userWordList.wordsList.name}</h2>
                        <h2 className="float-right">
                            <ListStatus userWordMasteries={userWordList.userWordMasteries} />
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {userWordList.userWordMasteries.map((wordMastery, j) => (
                            <div key={j} className="flex items-center justify-between">
                                <div className="float-left">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <Button variant="link" size="xs">
                                            {wordMastery.word.word}
                                        </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogDescription>
                                                Definition of {wordMastery.word.word}
                                            </DialogDescription>
                                            <DialogHeader>
                                            <DialogTitle>
                                                <div className="text-center">{wordMastery.word.word}</div>
                                            </DialogTitle>
                                            </DialogHeader>
                                                <div className="text-center items-center align-middle justify-between">
                                                    {wordMastery.word.definition}
                                                </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <h2 className="float-right">
                                    <WordStatus wordMasteryScore={wordMastery.masteryScore} />
                                </h2>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>)
            :
            null
        ))}
    </div>
  </div>
  );
}
function ListStatus( { userWordMasteries } : { userWordMasteries: UserWordMastery[] }) {
    const masteredWords = userWordMasteries.filter((wordMastery) => wordMastery.masteryScore == 1).length;
    const proficientWords = userWordMasteries.filter((wordMastery) => (wordMastery.masteryScore >= 0.75)).length;
    const learningWords = userWordMasteries.filter((wordMastery) => (wordMastery.masteryScore > 0)).length;

    if (masteredWords == userWordMasteries.length) {
        return (
            <div className="bg-[#f8f5ff] text-[#8e52ff] font-medium px-3 py-1 rounded-full text-sm">
                Mastered
            </div>
        );
    }
    else if (proficientWords == userWordMasteries.length) {
        return (
            <div className="bg-[#e6f7f2] text-[#1abc9c] font-bold px-3 py-1 rounded-full text-sm">
                Proficient
            </div>
        );
    }
    else if ((learningWords === 0 && proficientWords === 0 && masteredWords === 0)) {
        return (
            <div className="bg-[#fafafa] text-[#6b6b6b] font-bold px-3 py-1 rounded-full text-sm">
                Not started
              </div>
        );
    }
    else{
        return (
          <div className="bg-[#eef8ff] text-[#52b4ff] font-bold px-3 py-1 rounded-full text-sm">
            Learning
          </div>
        );
    }
}

function AllStatus( { userWordMasteries } : { userWordMasteries: UserWordMastery[] }) {
    const masteredWords = userWordMasteries.filter((wordMastery) => wordMastery.masteryScore == 1).length;
    const proficientWords = userWordMasteries.filter((wordMastery) => (wordMastery.masteryScore >= 0.75 && wordMastery.masteryScore < 1)).length;
    const learningWords = userWordMasteries.filter((wordMastery) => (wordMastery.masteryScore > 0 && wordMastery.masteryScore < 0.75)).length;
    const notStartedWords = userWordMasteries.filter((wordMastery) => wordMastery.masteryScore == 0).length;

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-[#f8f5ff] text-[#8e52ff] font-medium px-3 py-1 rounded-full text-lg">
                    Mastered: {masteredWords}
                </div>
                <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-lg">
                    Proficient: {proficientWords}
                </div>
                <div className="bg-[#eef8ff] text-[#52b4ff] font-medium px-3 py-1 rounded-full text-lg">
                    Learning: {learningWords}
                </div>
                <div className="bg-[#fafafa] text-[#6b6b6b] font-medium px-3 py-1 rounded-full text-lg">
                    Not started: {notStartedWords}
                </div>
            </div>
        </div>
    );
}

function WordStatus( { wordMasteryScore } : { wordMasteryScore: number }) {
    if (wordMasteryScore == 1) {
        return (
          <div className="bg-[#f8f5ff] text-[#8e52ff] font-medium px-3 py-1 rounded-full text-sm">
            Mastered
          </div>
        );
    } else if (wordMasteryScore >= 0.75) {
        return (
          <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
            Proficient
          </div>
        );
    } else if (wordMasteryScore > 0){
        return (
        <div className="bg-[#eef8ff] text-[#52b4ff] font-medium px-3 py-1 rounded-full text-sm">
            Learning
          </div>
        );
    } else {
        return(
            <div className="bg-[#fafafa] text-[#6b6b6b] font-medium px-3 py-1 rounded-full text-sm">
                Not started
            </div>
        )
    }
}