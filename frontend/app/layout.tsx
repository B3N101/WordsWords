import "@/app/globals.css";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavBar from "@/components/NavBar";
import Nav from "@/components/nav";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Words Words</title>
        <meta name="description" content="Words Words - A Vocab Builder" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <Analytics />
      <SpeedInsights />
      <body
        className={cn(
          "min-h-screen bg-background bg-tan dark:bg-red-950 font-sans antialiased",
          inter.className,
          ibm_plex_mono.className,
          poppins.className,
        )}
      >
        <Nav />
        {/* <NavBar /> */}
        {children}
      </body>
    </html>
  );
}
