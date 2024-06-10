import Image from "next/image";
import { auth } from "@/auth/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
      <div>
        <p className="text-green-600 font-extrabold text-xl">Home</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        {user && <p>Welcome, {user.name}!</p>}
      </div>
  );
}