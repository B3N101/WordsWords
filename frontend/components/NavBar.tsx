// import { auth, signIn, signOut } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { auth, signIn, signOut} from '@/auth/auth'
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function NavBar() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ModeToggle />
      </ThemeProvider>
      <div>WordsWords</div>

      <SignOutButton /> 
      <SignInButton />
    </nav>
  );
}


function SignInButton() {
  return (
    <form action={async () => {
        "use server"
        await signIn();
    }}>
        <Button type="submit">Sign-in</Button>
    </form>
  )
}
function SignOutButton() {
  return (
    <form action={async () => {
        "use server"
        await signOut();
    }}>
        <Button type="submit">Sign-in</Button>
    </form>
  )
}
