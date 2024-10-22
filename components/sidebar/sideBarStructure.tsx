/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DDF5Z5qLQw7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WordListSubMenu } from "./sideBarSubMenu";
import { ClassWordsListWithWordsList } from "@/prisma/types";
import { ClipboardList, Brain } from "lucide-react";

import Link from "next/link";

export default function SideBarStructure({
  wordLists,
  classID,
  isTeacher,
  className,
}: {
  wordLists: ClassWordsListWithWordsList[];
  classID: string;
  isTeacher: boolean;
  className: string;
}) {
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
          <span
            className={`text-lg font-semibold ${isExpanded ? "block" : "hidden"}`}
          >
            {className}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setIsSubMenuExpanded(false);
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
              <span
                className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
              >
                Home
              </span>
            </Link>
          </li>
          <li>
            <div
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              onClick={() => {
                if (isExpanded) {
                  setIsSubMenuExpanded(!isSubMenuExpanded);
                } else {
                  setIsExpanded(true);
                  setIsSubMenuExpanded(true);
                }
              }}
            >
              <BookIcon className="h-5 w-5" />
              <span
                className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
              >
                Word Lists
              </span>
              {isExpanded ? (
                <ChevronRightIcon
                  className={`h-5 w-5 ml-auto transition-transform duration-300 ${isSubMenuExpanded ? "rotate-90" : ""}`}
                />
              ) : null}
            </div>
            {isSubMenuExpanded ? (
              <WordListSubMenu wordLists={wordLists} />
            ) : null}
          </li>
          <li>
            {isTeacher ? (
              <Link
                href={"/class/" + classID + "/assign"}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
                prefetch={false}
              >
                <ClipboardList className="h-5 w-5" />
                <span
                  className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
                >
                  Assign Lists
                </span>
              </Link>
            ) : (
              <Link
                href={"/class/" + classID + "/wordAnalytics"}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
                prefetch={false}
              >
                <LineChartIcon className="h-5 w-5" />
                <span
                  className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
                >
                  Words and Analytics
                </span>
              </Link>
            )}
          </li>
          <li>
            <Link
              href={"/class/" + classID + "/people"}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              prefetch={false}
            >
              <UsersIcon className="h-5 w-5" />
              <span
                className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
              >
                People
              </span>
            </Link>
          </li>
          <li>
            {isTeacher ? null : (
              <Link
                href={"/class/" + classID + "/study"}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isExpanded ? "justify-start" : "justify-center"
                }`}
                prefetch={false}
              >
                <Brain className="h-5 w-5" />
                <span
                  className={`text-sm font-medium ${isExpanded ? "block" : "hidden"}`}
                >
                  Study
                </span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
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
  );
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
  );
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
  );
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
  );
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
      <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21"></path>
    </svg>
  );
}

// TODO: Fix assign icon
function AssignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M487.19,99.922l-79.6-79.7c-38.2-38.2-83.4-12.9-96.3,0l-259.6,260c-1.9,1.9-3.2,4.2-3.8,6.8l-47.5,203.7
			c-1.1,4.8,0.3,9.7,3.8,13.2c3.9,3.9,9.3,4.6,13.2,3.8l203.4-47.7c2.6-0.6,4.9-1.9,6.8-3.8l259.6-260
			C499.99,183.422,526.79,139.622,487.19,99.922z M281.49,90.022l58,58.1l-181.3,181.6c-3.5-13.4-10.6-26.4-21.2-36.9
			c-10.5-10.6-23.4-17.8-36.8-21.2L281.49,90.022z M32.99,475.122l11-46.9c14.5,9,26.9,21.4,35.9,35.9L32.99,475.122z
			 M209.39,433.822l-101,23.6c-13-24.5-33.3-44.9-57.8-57.8l23.6-101.2c14.3-3.1,30.7,2.3,42.8,14.4c13.2,13.2,18.5,31.6,13.5,46.8
			c-1.7,5.1-0.4,10.6,3.4,14.4s9.3,5.1,14.4,3.4c15.1-5,33.5,0.2,46.7,13.5C207.09,403.022,212.49,419.422,209.39,433.822z
			 M236.19,407.822c-3.5-13.4-10.6-26.3-21.2-36.9c-10.6-10.6-23.4-17.7-36.9-21.2l181.4-181.7l58,58.1L236.19,407.822z
			 M467.19,176.322l-29.8,29.9l-136-136.2l29.8-29.9c7.5-7.5,33.4-23.1,56.4,0l79.6,79.7
			C492.19,144.822,474.69,168.822,467.19,176.322z"
      />
    </svg>
  );
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
  );
}
