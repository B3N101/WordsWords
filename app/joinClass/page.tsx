import CreateClassCard from "@/components/classUtils/createClass";
import JoinClassCard from "@/components/classUtils/joinClass";
import { auth } from "@/auth/auth";
import { getUserRole } from "@/prisma/queries";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const userRole = await getUserRole(userId);

  if (userRole !== "STUDENT") {
    redirect("/");
  }

  return (
    <div className="m-auto items-center w-3/4 justify-center">
      <div>
        <JoinClassCard userId={userId} />
      </div>
    </div>
  );
}
