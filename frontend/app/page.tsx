import Image from "next/image";
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import Profile from "@/components/profile";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/api/auth/signin");


  // const User = {
  //   name: session.user.name,
  //   username: session.user.username,
  //   image: session.user.image,
  // };

  return (
    <div>
      <p className="text-green-600 font-extrabold text-xl">Home</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}