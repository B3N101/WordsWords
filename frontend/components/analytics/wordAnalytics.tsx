import { getUserWordListsWithMasteries } from "@/prisma/queries";
import { Card, CardContent } from "@/components/ui/card";
import { auth }  from "@/auth/auth";

export async function WordAnalytics( { classID }: { classID: string} ) {
    const session = await auth();
    const userID = session?.user?.id!;
    const userWordLists = await getUserWordListsWithMasteries(userID, classID);
    return (
    <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#ff6b6b]">Word Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userWordLists.map((userWordList, i) => (
            userWordList.userWordMasteries.length > 0 ?
            (
            <Card className="bg-white rounded-lg shadow-md, max-h-fit">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#ff6b6b]">{userWordList.wordsList.name}</h2>
                    </div>
                    <div className="space-y-4">
                        {userWordList.userWordMasteries.map((wordMastery, j) => (
                            <div key={wordMastery.wordId} className="flex items-center gap-4">
                                <div>{wordMastery.word.word}</div>
                                <WordStatus wordMasteryScore={wordMastery.masteryScore} />
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

function WordStatus( { wordMasteryScore } : { wordMasteryScore: number }) {
    if (wordMasteryScore == 1) {
        return (
          <div className="bg-[#eef8ff] text-[#52b4ff] font-medium px-3 py-1 rounded-full text-sm">
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
          <div className="bg-[#feffe9] text-[#f6ff80] font-medium px-3 py-1 rounded-full text-sm">
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