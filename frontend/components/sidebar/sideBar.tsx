import { auth } from "@/auth/auth";
import { getUserWordLists } from "@/prisma/queries";
import { cn } from "@/lib/utils";
import SideBarStructure  from "@/components/sidebar/sideBarStructure";

export async function SideBar(){
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      throw new Error("User not found");
    }
    const wordLists = await getUserWordLists(userId);
    
    return (
        <div>
            <SideBarStructure wordLists={wordLists}/>
        </div>
    );
}