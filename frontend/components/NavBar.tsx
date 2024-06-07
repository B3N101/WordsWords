// import { auth, signIn, signOut } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function NavBar() {
  // const session = await auth();
  // const user = session?.user;

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
      {/* {user ? <SignOutButton /> : <SignInButton />} */}
    </nav>
  );
}

function SignInButton() {
  return <Button type="submit">Sign-in</Button>;
}
function SignOutButton() {
  return <Button type="submit">Sign-out</Button>;
}
