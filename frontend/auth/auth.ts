import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/prisma";
import type { Provider } from "next-auth/providers";
import { pages } from "next/dist/build/templates/app-page";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google],
});

const providers: Provider[] = [GitHub, Google];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});
