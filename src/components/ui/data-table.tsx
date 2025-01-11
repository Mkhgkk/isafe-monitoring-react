import React, { useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TanTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useTranslation } from "react-i18next";

type Filter = {
  label: string;
  key: string;
  type: "text" | "select";
  options?: { label: string; value?: string }[];
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: Filter[];
  onRefresh?: () => void;
  loading: boolean;
  id: string;
};

function TableFilters({ filters, table }) {
  const { t } = useTranslation();
  return filters?.map((filter: Filter) => {
    const filterValue =
      (table.getColumn(filter.key)?.getFilterValue() as string) ?? "";
    const setFilterValue = (value: string) =>
      table.getColumn(filter.key)?.setFilterValue(value);

    switch (filter.type) {
      case "select":
        return (
          <Select
            key={filter.key}
            value={filterValue}
            onValueChange={setFilterValue}
          >
            <SelectTrigger
              className={cn("h-10 lg:w-[150px]", {
                "border border-primary": filterValue,
              })}
            >
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent side="top">
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "text":
        return (
          <Input
            key={filter.key}
            placeholder={t("common.searchBy", { key: filter.label })}
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className={cn("lg:w-[200px]", {
              "border border-primary": filterValue,
            })}
          />
        );

      default:
        return null;
    }
  });
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  onRefresh,
  loading,
  id,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border p-4 flex flex-col max-w-full overflow-hidden">
      <div className="mb-4 flex justify-between items-center">
        <div className="hidden lg:flex items-center gap-2">
          <TableFilters table={table} filters={filters} />
        </div>
        <Popover>
          <PopoverTrigger className="lg:hidden">
            <Button size="icon" className="w-9 h-9" variant="outline">
              <Icons.filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-y-2">
              <TableFilters table={table} filters={filters} />
            </div>
          </PopoverContent>
        </Popover>

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <Icons.refresh
              className={`w-4 h-4 lg:mr-1.5 text-zinc-800 dark:text-white ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span className="lg:block hidden">{t("common.refresh")}</span>
          </Button>
        )}
      </div>
      <div className="border rounded-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-black dark:text-white text-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                        cell.getContext()
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
                  {t("common.noResult")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} tableId={id} />
      </div>
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanTable<TData>;
  tableId: string;
}

export function DataTablePagination<TData>({
  table,
  tableId,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  useEffect(() => {
    const savedPageSize = localStorage.getItem(`${tableId}-pageSize`);
    if (savedPageSize) {
      table.setPageSize(Number(savedPageSize));
    }
  }, []);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{t("common.rowsPerPage")}</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
            localStorage.setItem(`${tableId}-pageSize`, value); // Save new page size to local storage
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only"></span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only"></span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only"></span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only"></span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function SortingHeader({ column, title }) {
  return (
    <Button
      variant="ghost"
      className="p-0 hover:bg-transparent"
      onClick={() => column.toggleSorting()}
    >
      {title}
      <Icons.arrowUpDown
        className={cn(
          "ml-2 h-4 w-4 text-muted-foreground ",
          column.getIsSorted() && "text-blue-500"
        )}
      />
    </Button>
  );
}
