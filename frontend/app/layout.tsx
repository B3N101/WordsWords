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
        <title>Words Words</title>
        <meta name="description" content="Words Words - A Vocab Builder" />
        {/* favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <Analytics />
      <body
        className={cn(
          "min-h-screen bg-background bg-tan dark:bg-red-950 font-sans antialiased",
          inter.className,
          ibm_plex_mono.className,
          poppins.className,
        )}
      >
        <NavBar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
