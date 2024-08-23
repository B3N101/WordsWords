"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addStudentToClass } from "@/actions/class_student_actions";
import { useToast } from "./ui/use-toast";

export default function JoinClassCard({ userId }: { userId: string }) {
  const [classCode, setClassCode] = useState<string>("");
  const { toast } = useToast();

  const handleJoinClass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Call the server action
      await addStudentToClass(classCode, userId);
      toast({
        title: "Success",
        description: "Successfully joined the class!",
      });
    } catch (error) {
      console.error("Failed to join class:", error);
      toast({
        title: "Error",
        description: "Failed to join the class. Please try again.",
      });
    }
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
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
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
