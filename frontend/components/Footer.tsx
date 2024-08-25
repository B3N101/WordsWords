/**
 * v0 by Vercel.
 * @see https://v0.dev/t/HAZTUYaPksR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth/auth";
import Link from "next/link";

function getInitials(name: string) {
  const names = name.split(" ");
  return names
    .map((name) => name[0])
    .join("")
    .toUpperCase();
}

export default async function Footer() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const name: string = session!.user!.name!;
  const imageSrc: string = session!.user!.image!;
  const email: string = session!.user!.email!;

  return (
    <footer className="bg-muted py-6 border-t w-full bottom-0 mt-6">
      <div className="container max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={imageSrc} alt="Profile Pic" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 font-medium text-sm font-muted-foreground">
            <p>{name}</p>
            <p>{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <p>&copy; 2024 Middlesex School</p>
          <Separator orientation="vertical" />
          <p>Developed by Ben Feuer &amp; Ian Lam</p>
          <Separator orientation="vertical" />
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
