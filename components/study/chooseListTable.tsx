"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createNewStudySpace,
} from "@/actions/study_space";
import {
  ChooseListTableType,
} from "@/components/study/chooseListsColumns";

import { Grade } from "@prisma/client";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initial_data: TData[];
  userId: string;
  classId: string;
}

export function ChooseListsTable<TData, TValue>({
  columns,
  initial_data,
  userId,
  classId,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<TData[]>(initial_data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,

    state: {
      columnFilters,
      rowSelection,
    },
  });
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 w-full">
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
      </div>
      <div className="flex items-center justify-center space-x">
        <CreateStudySpaceCard
          listIds={table.getFilteredSelectedRowModel().rows.map((row) => {
            const rowCasted = row.original as ChooseListTableType;
            return rowCasted.id;
          })}
          userId={userId}
          classId={classId}
        />
      </div>
    </div>
  );
}

type CreateStudySpaceCardProps = {
  listIds: string[];
  userId: string;
  classId: string;
};
function CreateStudySpaceCard({
  listIds,
  userId,
  classId,
}: CreateStudySpaceCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleWordsListAssignment = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try{
        await createNewStudySpace(
            userId,
            classId,
            listIds,
        );
    }
    catch (error){
        console.error(error);
    }
    setIsLoading(false);
    return toast({
      title: "Success!",
      description: "Study Space Created!",
      action: <ToastAction altText="Refresh" onClick={() => {window.location.reload()}}>Refresh</ToastAction>,
        });
    };
  return (
    <form onSubmit={handleWordsListAssignment}>
      <div className="grid gap-4 m-4">
        <div className="grid grid-cols-2 gap-2">
        </div>
        <Button type="submit" disabled={isLoading || listIds.length === 0}>
          {isLoading
              ? "Creating Study Space..."
              : "Create Study Space"
              }
        </Button>
      </div>
    </form>
  );
}
