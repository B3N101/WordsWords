/**
 * v0 by Vercel.
 * @see https://v0.dev/t/yx8cGFDlmc4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type ClassData = {
  className: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  classID: string;
};

export default function ClassDashboard({ data }: { data: ClassData[] }) {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#ff6b6b]">My Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((classData) => (
          <ClassCard key={classData.className} data={classData} />
        ))}
      </div>
    </div>
  );
}

function ClassCard({ data }: { data: ClassData }) {
  return (
    <Link href={`/class/${data.classID}`}>
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#ff6b6b]">
              {data.className}
            </h2>
            {data.startDate < new Date() && data.endDate > new Date() ? (
              <ClassStatus status="active" />
            ) : data.startDate > new Date() ? (
              <ClassStatus status="upcoming" />
            ) : (
              <ClassStatus status="completed" />
            )}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="w-5 h-5 text-[#9b59b6]" />
            <div className="text-[#7f8c8d]">{data.teacherName}</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <CalendarIcon className="w-5 h-5 text-[#9b59b6]" />
            <div className="text-[#7f8c8d]">
              {data.startDate.toLocaleDateString()} {" - "}{" "}
              {data.endDate.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ClassStatus({
  status,
}: {
  status: "active" | "upcoming" | "completed";
}) {
  if (status === "active") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium px-3 py-1 rounded-full text-sm">
        Active
      </div>
    );
  } else if (status === "upcoming") {
    return (
      <div className="bg-[#fef7f2] text-[#e67e22] font-medium px-3 py-1 rounded-full text-sm">
        Upcoming
      </div>
    );
  } else {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium px-3 py-1 rounded-full text-sm">
        Completed
      </div>
    );
  }
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
