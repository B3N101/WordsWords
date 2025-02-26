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
import { deleteClass } from "@/actions/class_actions";
export default function DeleteClassButton({ classID }: { classID: string }) {
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