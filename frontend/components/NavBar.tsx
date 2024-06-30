import { auth, signIn, signOut } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-sans antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ModeToggle />
      </ThemeProvider>
      <div>WordsWords</div>
      {user ? <SignOutButton /> : <SignInButton />}
    </nav>
  );
}
function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}

export function SignOutButton() {
  return (
    // link to sign out page
    <Link href="/api/auth/signout">
      Sign out
    </Link>
    // <form
    //   action={async () => {
    //     "use server";
    //     await signOut();
    //   }}
    // >
    //   <button type="submit">Sign Out</button>
    // </form>
  );
}
