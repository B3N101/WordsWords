import { auth } from "@/auth/index";
import AuthButton from "./AuthButton.server";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <p className="text-green-600 font-extrabold text-xl">Home</p>
      <AuthButton />
    </div>
  );
}
