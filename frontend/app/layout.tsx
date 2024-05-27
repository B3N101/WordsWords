import "@/app/globals.css"
import { Inter as FontSans } from "next/font/google"
 
import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 
export default function Layout({
  children,
  }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background bg-red-300 font-sans antialiased",
          fontSans.variable
        )}
      >
      {children}
      </body>
    </html>
  )
}
