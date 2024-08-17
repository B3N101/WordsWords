"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUserWordsListForClass } from "@/actions/wordlist_assignment"
import { WordsListWithWordsAndUserWordsList } from "@/prisma/types"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  userId: string
  classId: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userId,
  classId
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,

    state:{
      columnFilters,
      rowSelection,
    }
  })
  return (
    <div>
        <div className="flex items-center py-4">
        <Input
          placeholder="Filter WordsLists..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
        <AssignWordsListCard listIds={
          table.getFilteredSelectedRowModel().rows.map(row => {
            const rowCasted = row.original as WordsListWithWordsAndUserWordsList
            return rowCasted.listId
          })} 
          userId={userId}
          classId={classId} 
          />
      </div>

    </div>
    
  )
}

function AssignWordsListCard({ listIds, userId, classId} : { listIds: string[], userId: string, classId: string }) {
  console.log("ListIds", listIds)
  const [isLoading, setIsLoading] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<string>("");

  const handleWordsListAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("submitting form with date " + dueDate)
    for (const wordsListId of listIds)
    {
      try {
        await createUserWordsListForClass(userId, wordsListId, classId, new Date(dueDate));
      } catch (error) {
        console.error(error);
      } 
    }
    setIsLoading(false);
  }
  return (
    <form onSubmit={handleWordsListAssignment}>
      <div className="grid gap-4">
        <div className="grid gap-2"> 
          <Label htmlFor="dueDate">Due Date</Label>
          <Input type="date" 
          id="dueDate" 
          value={dueDate} 
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          required />
        </div>
        <Button disabled={isLoading}>
          {isLoading ? "Assigning..." : "Assign"}
        </Button>
      </div>
    </form>
  )
}