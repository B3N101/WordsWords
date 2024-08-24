import { auth } from "@/auth/auth";
import { getUserWordLists, getClass } from "@/prisma/queries";
import { cn } from "@/lib/utils";
import SideBarStructure from "@/components/sidebar/sideBarStructure";
export async function SideBar({ classID }: { classID: string }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

    const thisClass = await getClass(classID);
    const wordLists = await getUserWordLists(userId);

    if (!thisClass) {
        throw new Error("Class not found");
    }
    
    return (
        <div>
            <SideBarStructure wordLists={wordLists} classID={classID} isTeacher={thisClass?.teacherId === userId} className={thisClass.className}/>
        </div>
    );
}
