import { WordsList } from "@prisma/client";
import { auth } from "@/auth/auth";
import { getUserWordLists } from "@/prisma/queries";
import { SidebarItem } from "./sidebarItem";
import { cn } from "@/lib/utils";
// type SideBarProps = {
//     wordLists: WordsList[];
// }

export async function SideBar(){
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      throw new Error("User not found");
    }
    const wordLists = await getUserWordLists(userId);
    
    return (
        <div className={cn(
          "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        )}>
          {wordLists.map((wordlist, index) => (
            <div key={index}>
            <SidebarItem label={wordlist.wordsListListId} href={"/wordList/" + wordlist.wordsListListId}></SidebarItem>
            </div>
          ))}
        </div>
    );
}