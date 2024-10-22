"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Word, Grade } from "@prisma/client";
import { WordsListWithWordsAndUserWordsList } from "@/prisma/types";
import {
  deleteClassWordsList,
  deleteUserWordsListForClass,
} from "@/actions/wordlist_assignment";
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

export type ChooseListTableType = {
  id: string;
  name: string;
  words: Word[];
  classId: string;
};

// New component for the action cell
const ActionCell = ({ wordslist }: { wordslist: ChooseListTableType }) => {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ChooseListTableType>[] = [
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
    accessorKey: "name",
    header: () => <div className="font-bold text-lg">Name</div>,
  },
  {
    id: "actions",
    header: () => <div className="font-bold text-lg">Actions</div>,
    cell: ({ row }) => <ActionCell wordslist={row.original} />,
  },
];
