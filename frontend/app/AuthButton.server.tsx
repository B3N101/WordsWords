import { SessionProvider } from "next-auth/react";
import { BASE_PATH, auth } from "@/auth";

import AuthButtonClient from "./AuthButton.client";

export default async function AuthButton() {
  const session = await auth();
  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <AuthButtonClient />
    </SessionProvider>
  );
}