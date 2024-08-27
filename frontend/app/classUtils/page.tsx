import CreateClassCard from "@/components/classUtils/createClass";
import JoinClassCard from "@/components/classUtils/joinClass";
import { auth } from "@/auth/auth";
import { getUserRole } from "@/prisma/queries";

export default async function Page() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("User not found");
    }

    const userRole = await getUserRole(userId);
  
    return (
        <div className="m-auto items-center w-3/4 justify-center">
            {
                userRole === "TEACHER" || userRole === "ADMIN" ?
                <div>
                    <CreateClassCard teacherId={userId}/>
                </div>
                :
                <div>
                    <JoinClassCard userId={userId}/>
                </div>
            }
        </div>
    );
}