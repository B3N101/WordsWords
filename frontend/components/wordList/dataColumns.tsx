"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Word } from "@prisma/client"
import { WordsListWithWordsAndUserWordsList } from "@/prisma/types"

import { MoreHorizontal } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WordsListStatus = "Unassigned" | "Completed" | "Active"

export type WordListTableType = {
  id: string
  status: WordsListStatus
  name: string
  words: Word[]
}


export const columns: ColumnDef<WordsListWithWordsAndUserWordsList>[] = [
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
    header: "Status",
    cell: ({ row }) => {
      const status: WordsListStatus = row.getValue("status")
      return <ListStatusDisplay status={status} />
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const wordslist = row.original;
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
                    Assign Wordslist
                  </DropdownMenuItem>
                </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign {wordslist.name}</DialogTitle>
                      <DialogDescription>
                        <div>Select a due date to assign the list</div>
                      </DialogDescription>
                    </DialogHeader>
                    {/* <form onSubmit={}>
                      <input type="date" />
                      <Button>Assign</Button>
                    </form> */}
                  </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div>View Words</div>
                  </DropdownMenuItem>
                </DialogTrigger>
                  <DialogContent>
                    <DialogDescription>
                    </DialogDescription>
                    <DialogHeader>
                      <DialogTitle>
                        <div className="text-center ">Words</div>
                      </DialogTitle>
                    </DialogHeader>
                      {wordslist.words.map((word, i) => (
                          <div key={i} className="space-y-4 text-center items-center align-middle justify-between">
                              {word.word}
                          </div>
                      ))}
                  </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
      )
    },
  },
]

function ListStatusDisplay({ status }: { status: WordsListStatus }) {
  if (status === "Completed") {
    return (
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium text-right w-min">
        Finished
      </div>
    );
  } else if (status === "Active") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium text-right w-min">
        Active
      </div>
    );
  } else {
    return (
      <div className="bg-[#fafafa] text-[#6b6b6b] font-medium text-right w-min">
         Unassigned 
      </div>
    );
  }
}
