import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <SignIn />
      <SignOut />
      <p className="text-green-600 font-extrabold text-xl">Home</p>
    </div>
  );
}
