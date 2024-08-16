"use client"

import { ColumnDef } from "@tanstack/react-table"
import { WordsList } from "@prisma/client"
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WordsListStatus = "Unassigned" | "Completed" | "Active"

export type WordListTableType = {
  id: string
  status: WordsListStatus
  name: string
}

export const columns: ColumnDef<WordsList>[] = [
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
      const payment = row.original
 
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
                    Assign Wordslists
                  </DropdownMenuItem>
                </DialogTrigger>
                  <DialogContent>
                    Assign Wordslists box
                  </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    View Words
                  </DropdownMenuItem>
                </DialogTrigger>
                  <DialogContent>
                    View Words box
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
      <div className="bg-[#e6f7f2] text-[#1abc9c] font-medium rounded-full text-right w-min">
        Finished
      </div>
    );
  } else if (status === "Active") {
    return (
      <div className="bg-[#f2f7fe] text-[#3498db] font-medium rounded-full text-right w-min">
        Active
      </div>
    );
  } else {
    return (
      <div className="bg-[#fafafa] text-[#6b6b6b] font-medium rounded-full text-right w-min">
         Unassigned 
      </div>
    );
  }
}
