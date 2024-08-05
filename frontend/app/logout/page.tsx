/**
 * v0 by Vercel.
 * @see https://v0.dev/t/r9jJQ5aaIlC
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "@/auth/auth";
import { redirect } from "next/dist/server/api-utils";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F0FFF4] dark:bg-[#00B894]">
      <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-[#00D1B2]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[#00B894]">Sign Out</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="space-y-4">
          <form
            action={async (formData) => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              type="submit"
              className="w-full rounded-md bg-[#00B894] text-white hover:bg-[#00D1B2] focus:ring-[#00D1B2]"
            >
              Sign Out
            </Button>
          </form>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center rounded-md bg-white text-[#00B894] border border-[#00B894] hover:bg-[#00B894] hover:text-[#fff] focus:ring-[#00D1B2]"
            prefetch={false}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
