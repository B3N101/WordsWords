/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/QSRRkvPQ4e5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth/auth";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 sm:px-6">
      <div className="flex items-center justify-center flex-1">
        <Link
          href="/"
          className="flex items-center gap-2 justify-center"
          prefetch={false}
        >
          {/* prevent image drag */}
          <Image
            src="/icon.png"
            alt="icon"
            width={124}
            height={124}
            className="no-drag"
          />
          {/* <Image src="/icon.png" alt="icon" width={124} height={124} /> */}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-xs">
            <nav className="grid gap-4 p-4">
              <Link
                href="/quiz"
                className="text-sm font-medium hover:underline hover:underline-offset-4"
                prefetch={false}
              >
                Quizzes
              </Link>
              <Link
                href="/words"
                className="text-sm font-medium hover:underline hover:underline-offset-4"
                prefetch={false}
              >
                Words
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:underline hover:underline-offset-4"
                prefetch={false}
              >
                Class
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline hover:underline-offset-4"
                prefetch={false}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline hover:underline-offset-4"
                prefetch={false}
              >
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden gap-4 md:flex">
          <Link
            href="/quiz"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch={false}
          >
            Quizzes
          </Link>
          <Link
            href="/words"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch={false}
          >
            Words
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch={false}
          >
            Class
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <SettingsIcon className="h-6 w-6" />
              <span className="sr-only">Open settings menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* If auth logout else login */}
              {session ? (
                <Link href={"/logout"}>Logout</Link>
              ) : (
                <Link href={"/login"}>Logout</Link>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
