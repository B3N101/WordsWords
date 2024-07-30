/**
 * v0 by Vercel.
 * @see https://v0.dev/t/E6bwvrh38fR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function JoinClassCard() {
  const [newClass, setNewClass] = useState({
    name: "",
    startDate: null,
    endDate: null,
    classCode: "",
  });
  const [joinClass, setJoinClass] = useState("");
//   const handleNewClassSubmit = () => {
//     const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
//     setNewClass({ ...newClass, classCode });
//   };
  const handleJoinClass = () => {
    console.log(`Joining class with code: ${joinClass}`);
  };
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#ff6b6b]">Join a Class</h2>
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleJoinClass}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input
                  id="classCode"
                  value={joinClass}
                  onChange={(e) => setJoinClass(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="justify-self-end">
                Join Class
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
