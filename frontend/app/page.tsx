import Image from "next/image";
import { auth } from "@/auth/auth";

export default async function Home() {
  const session = await auth();


  return (
    <div>
      <p className="text-green-600 font-extrabold text-xl">Home</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
