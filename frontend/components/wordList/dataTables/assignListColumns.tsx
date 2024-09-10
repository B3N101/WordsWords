"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Word, Grade } from "@prisma/client";
import { WordsListWithWordsAndUserWordsList } from "@/prisma/types";
import { deleteClassWordsList, deleteUserWordsListForClass } from "@/actions/wordlist_assignment";
import { Link, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "antd";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WordsListStatus = "Unassigned" | "Completed" | "Active";

export type WordListTableType = {
  id: string;
  status: WordsListStatus;
  grade: Grade;
  name: string;
  words: Word[];
  classId: string;
};

// New component for the action cell
const ActionCell = ({ wordslist }: { wordslist: WordListTableType }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div>View Words</div>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogDescription></DialogDescription>
            <DialogHeader>
              <DialogTitle>
                <div className="text-center ">Words</div>
              </DialogTitle>
            </DialogHeader>
            {wordslist.words.map((word, i) => (
              <div
                key={i}
                className="space-y-4 text-center items-center align-middle justify-between"
              >
                {word.word}
              </div>
            ))}
          </DialogContent>
        </Dialog>
        {wordslist.status !== "Unassigned" ? (
          <DropdownMenuItem
            onClick={() =>
              (window.location.href =
                "/class/" + wordslist.classId + "/" + wordslist.id)
            }
          >
            Go to List Page
          </DropdownMenuItem>
        ) : null}
        {wordslist.status !== "Unassigned" ? (
          <Dialog>
            <DialogTrigger>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div>Reset List</div>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription>
                Reset this wordslist for all students
              </DialogDescription>
              <DialogHeader>
                <DialogTitle>
                  <div className="text-center ">
                    {"Reset " + wordslist.name}
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="text-center">
                <p>Are you sure you want to reset this list?</p>
                <p className="font-bold">This action cannot be undone!</p>
              </div>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteUserWordsListForClass(
                    wordslist.id,
                    wordslist.classId,
                  );
                  await deleteClassWordsList(wordslist.id, wordslist.classId);
                  setIsDeleting(false);

                  toast({
                    title: "Success!",
                    description: "Wordslist reset",
                  });
                  window.location.reload();
                }}
              >
                {isDeleting ? "Resetting ..." : "Reset"}
              </Button>
            </DialogContent>
          </Dialog>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<WordListTableType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="font-bold text-lg">Status</div>,
    cell: ({ row }) => {
      const status: WordsListStatus = row.getValue("status");
      return <ListStatusDisplay status={status} />;
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="font-bold text-lg">Name</div>,
  },
  {
    accessorKey: "grade",
    header: () => <div className="font-bold text-lg">Grade</div>,
    cell: ( {row } ) => {
      const grade = row.original.words[0].gradeLevel;
      return <div>{grade}</div>;
    }
  },
  {
    id: "actions",
    header: () => <div className="font-bold text-lg">Actions</div>,
    cell: ({ row }) => <ActionCell wordslist={row.original} />,
  },
];

function ListStatusDisplay({ status }: { status: WordsListStatus }) {
  if (status === "Completed") {
    return (
      <span className="flex flex-row gap-2">
        <Badge color="green" />
        <h1>Completed</h1>
      </span>
    );
  } else if (status === "Active") {
    return (
      <span className="flex flex-row gap-2">
        <Badge color="blue" status="processing" />
        <h1>Active</h1>
      </span>
      // <div className="bg-[#f2f7fe] text-[#3498db] font-medium text-right w-min">
      //   Active
      // </div>
    );
  } else {
    return (
      <span className="flex flex-row gap-2">
        <Badge status="default" />
        <h1>Unassigned</h1>
      </span>
      // <div className="bg-[#fafafa] text-[#6b6b6b] font-medium text-right w-min">
      //   Unassigned
      // </div>
    );
  }
}
