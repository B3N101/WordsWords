import "@/app/globals.css";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
});

const ibm_plex_mono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MX Words Words",
  description: "Middlesex School's Vocab Trainer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="MjRyMh8v-9qExGvA9C7L37ZdBcKzZGpKJodT2uznVxo"
        />
      </head>
      <Analytics />
      <body
        className={cn(
          "flex flex-col min-h-screen bg-background bg-tan dark:bg-red-950 font-sans antialiased",
          inter.className,
          ibm_plex_mono.className,
          poppins.className,
        )}
      >
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
