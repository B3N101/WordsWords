import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth/auth";
import { AuthError } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import { providers, getSession, csrfToken } from "next-auth/client";
import Component from "./component";

export default async function SignInPage() {
  return (
    <div className="flex flex-col gap-2">
      <Component />
    </div>
  );
}
