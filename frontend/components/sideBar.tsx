import { WordsList } from "@prisma/client";
import { auth } from "@/auth/auth";
import { getUserWordLists } from "@/prisma/queries";

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
  
    return true;
}