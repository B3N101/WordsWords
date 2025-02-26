"use client";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { X } from "lucide-react";
import { deleteClass, removeUserFromClass } from "@/actions/class_actions";
export function DeleteClassButton({ classID }: { classID: string }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();
    return (
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
                Delete Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogDescription>
              Delete Class
            </DialogDescription>
            <DialogHeader>
              <DialogTitle>
                <div className="text-center ">
                  {"Delete Class"}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p>Are you sure you want to delete this class?</p>
              <p className="font-bold">This action cannot be undone!</p>
            </div>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                await deleteClass(classID);
                toast({
                  title: "Success!",
                  description: "Class Deleted",
                });
                router.replace("/");
              }}
            >
              {isDeleting ? "Deleting ..." : "Delete"}
            </Button>
          </DialogContent>
        </Dialog>
    );
  }

  export function RemoveStudentButton({ classID, userID }: { classID: string; userID: string }) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    return (
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
                <X />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogDescription>
              Remove Student
            </DialogDescription>
            <DialogHeader>
              <DialogTitle>
                <div className="text-center ">
                  {"Remove Student"}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p>Are you sure you want to remove this student from the class?</p>
              <p className="font-bold">This action cannot be undone!</p>
            </div>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                await removeUserFromClass(classID, userID);
                toast({
                  title: "Success!",
                  description: "Student Removed",
                });
                window.location.reload();
              }}
            >
              {isDeleting ? "Removing ..." : "Remove"}
            </Button>
          </DialogContent>
        </Dialog>
    );
  }