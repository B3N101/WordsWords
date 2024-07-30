/**
 * v0 by Vercel.
 * @see https://v0.dev/t/E6bwvrh38fR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CreateClassCard() {
  const [newClass, setNewClass] = useState({
    name: "",
    startDate: null,
    endDate: null,
    classCode: "",
  });
//   const [joinClass, setJoinClass] = useState("");
  const handleNewClassSubmit = () => {
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewClass({ ...newClass, classCode });
  };
//   const handleJoinClass = () => {
//     console.log(`Joining class with code: ${joinClass}`);
//   };
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#ff6b6b]">
        Create a New Class
      </h2>
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleNewClassSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input id="classCode" value={newClass.classCode} readOnly />
              </div>
              <Button type="submit" className="justify-self-end">
                Create Class
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
