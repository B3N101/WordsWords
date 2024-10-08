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
  createUserWordsListForClass,
  createClassWordsList,
} from "@/actions/wordlist_assignment";
import {
  WordListTableType,
  WordsListStatus,
} from "@/components/wordList/dataTables/assignListColumns";

import { Grade } from "@prisma/client";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initial_data: TData[];
  userId: string;
  classId: string;
}

export function DataTable<TData, TValue>({
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
        <div className="flex items items-center p-4 gap-2 justify-end">
          <Label>Filter by Status: </Label>
          <select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-tan outline-black"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Unassigned">Unassigned</option>
          </select>
          <Label>Filter by Grade: </Label>
          <select
            value={(table.getColumn("grade")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("grade")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-tan outline-black"
          >
            <option value="">All</option>
            <option value={Grade.NINE}>Ninth</option>
            <option value={Grade.TEN}>Tenth</option>
            <option value={Grade.ELEVEN}>Eleventh</option>
          </select>
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
        <AssignWordsListCard
          listIds={table.getFilteredSelectedRowModel().rows.map((row) => {
            const rowCasted = row.original as WordListTableType;
            return rowCasted.id;
          })}
          userId={userId}
          classId={classId}
          statuses={table.getFilteredSelectedRowModel().rows.map((row) => {
            const rowCasted = row.original as WordListTableType;
            return rowCasted.status;
          })}
          tableData={data as WordListTableType[]}
          setTableData={
            setData as React.Dispatch<React.SetStateAction<WordListTableType[]>>
          }
        />
      </div>
    </div>
  );
}

type AssignWordsListCardProps = {
  listIds: string[];
  userId: string;
  classId: string;
  statuses: string[];
  tableData: WordListTableType[];
  setTableData: React.Dispatch<React.SetStateAction<WordListTableType[]>>;
};
function AssignWordsListCard({
  listIds,
  userId,
  classId,
  statuses,
  tableData,
  setTableData,
}: AssignWordsListCardProps) {
  const { toast } = useToast();
  console.log("ListIds", listIds, " Statuses", statuses);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<string>("");

  const anyActive = statuses.some(
    (status) => status === "Active" || status === "Completed",
  );
  const handleWordsListAssignment = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    for (const wordsListId of listIds) {
      try {
        await createUserWordsListForClass(
          userId,
          wordsListId,
          classId,
          new Date(dueDate),
        );
        await createClassWordsList(
          userId,
          wordsListId,
          classId,
          new Date(dueDate),
        );
      } catch (error) {
        console.error(error);
      }
    }
    const newData = tableData.map((row) => {
      for (const wordsListId of listIds) {
        if (row.id === wordsListId) {
          return { ...row, status: "Active" as WordsListStatus };
        }
      }
      return row;
    });
    setTableData(newData);
    setIsLoading(false);
    return toast({
      title: "Success!",
      description: "Wordslists assigned.",
      // action: <ToastAction altText="Refresh" onClick={() => {window.location.reload()}}>Refresh</ToastAction>,
    });
  };
  return (
    <form onSubmit={handleWordsListAssignment}>
      <div className="grid gap-4 m-4">
        <div className="grid grid-cols-2 gap-2">
          <h1 className="grid place-items-center">Select Due Date</h1>
          <Input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading || listIds.length === 0}>
          {anyActive
            ? isLoading
              ? "Changing due date..."
              : "Change Due Date"
            : isLoading
              ? "Assigning..."
              : "Assign"}
        </Button>
      </div>
    </form>
  );
}
