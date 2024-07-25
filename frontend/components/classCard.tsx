/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QKsJgJZnfim
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export interface ClassCardProps {
  title: string;
  description: string;
}

export default function ClassCard({ title, description }: ClassCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex items-center justify-between bg-lightgreen">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between bg-tan text-secondary-foreground p-6">
        <p className="text-muted-foreground">{description}</p>
        <Link
          href="#"
          className="inline-flex items-center justify-center rounded-md bg-lightgreen px-4 py-2 text-sm font-medium text-black shadow-sm transition-colors hover:bg-lightgreen/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          prefetch={false}
        >
          Enter Class
        </Link>
      </CardContent>
    </Card>
  );
}
