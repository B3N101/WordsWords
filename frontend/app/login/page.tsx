// @ts-nocheck
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FgckyDvpe1M
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { signIn, auth, providerMap } from "@/auth/auth";
import { AuthError } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default async function SignInPage() {
  // if signed in, redirect to home
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F0FFF4] dark:bg-[#00B894]">
        <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-[#00D1B2]">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#00B894]">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to your account using your Github/Google account.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              try {
                await signIn("github", { redirectTo: "/" });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                }
                throw error;
              }
            }}
          >
            <Button
              variant="outline"
              className="w-full rounded-md bg-[#00B894] text-white hover:bg-[#00D1B2] focus:ring-[#00D1B2]"
              type="submit"
            >
              <GitHubIcon className="mr-2 h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              try {
                await signIn("google", { redirectTo: "/" });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                }
                throw error;
              }
            }}
          >
            <Button
              variant="outline"
              className="w-full rounded-md bg-[#00B894] text-white hover:bg-[#00D1B2] focus:ring-[#00D1B2]"
              type="submit"
            >
              <ChromeIcon className="mr-2 h-5 w-5" />

              <span>Sign in with Google</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268" />
      <path d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267" />
    </svg>
  );
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
