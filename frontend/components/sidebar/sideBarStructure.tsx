/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DDF5Z5qLQw7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WordListSubMenu } from "./sideBarSubMenu"
import { UserWordsListProgressWithWordsList } from "@/prisma/types";

import Link from "next/link"

export default function SideBarStructure({ wordLists, classID}: { wordLists: UserWordsListProgressWithWordsList[], classID: string }) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubMenuExpanded, setIsSubMenuExpanded] = useState(false);

  return (
    <aside
      className={`flex h-screen flex-col bg-background transition-all duration-300 left-0 top-0 px-4 border-r-2 ${
        isExpanded ? "w-64" : "w-16" 
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b bg-background px-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-semibold ${isExpanded ? "block" : "hidden"}`}>WordsWords</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setIsExpanded(!isExpanded)
            setIsSubMenuExpanded(false)
          }}
          className={`rounded-full transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        >
          <ThreeLinesIcon className="h-6 w-6 text-primary" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <nav className="flex-1 overflow-visible">
        <ul className="grid gap-y-2 gap-x-0 p-0">
          <li>
            <Link
              href={"/class/" + classID}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              prefetch={false}
            >
              <HomeIcon className="h-5 w-5" />
              <span className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}>Home</span>
            </Link>
          </li>
          <li>
            <div
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              onClick={() => {
                if (isExpanded)
                {
                  setIsSubMenuExpanded(!isSubMenuExpanded);
                }
                else{
                  setIsExpanded(true);
                  setIsSubMenuExpanded(true);
                }
              }
            }
            >
              <BookIcon className="h-5 w-5" />
              <span className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}>Word Lists</span>
              {isExpanded ?
              <ChevronRightIcon
                className={`h-5 w-5 ml-auto transition-transform duration-300 ${isSubMenuExpanded ? "rotate-90" : ""}`}
              />
              :
              null}
            </div>
            {isSubMenuExpanded ? (
              <WordListSubMenu wordLists={wordLists}/>
            ):
            null
            }  
            
          </li>
          <li>
            <Link
              href={"/class/" + classID + "/wordAnalytics"}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              prefetch={false}
            >
              <LineChartIcon className="h-5 w-5" />
              <span className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}>History</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              prefetch={false}
            >
              <UsersIcon className="h-5 w-5" />
              <span className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}>People</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
function ThreeLinesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 12h20" />
      <path d="M2 6h20" />
      <path d="M2 18h20" />
    </svg>
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function LineChartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
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
    <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

    </svg>
  )
}


function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}