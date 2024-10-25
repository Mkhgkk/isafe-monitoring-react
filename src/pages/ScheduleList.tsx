import { scheduleService } from "@/api";
import { Icons } from "@/components/icons";
import DeleteScheduleDialog from "@/components/schedule/delete-schedule-dialog";
import ScheduleForm from "@/components/schedule/schedule-form";
import { Button } from "@/components/ui/button";
import { DataTable, SortingHeader } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ScheduleDocument } from "@/type";
import { getDateFromUnixTimestamp } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

function ScheduleList() {
  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["scheduleService.fetchAllSchedules"],
    queryFn: scheduleService.fetchAllSchedules,
  });

  const columnHelper = createColumnHelper<ScheduleDocument>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("stream_id", {
        id: "id",
        header: "",
        cell: ({ row }) => <span className="pl-3">{row.index + 1}</span>,
      }),
      columnHelper.accessor("stream_id", {
        id: "stream_id",
        header: ({ column }) => (
          <SortingHeader column={column} title="Stream ID" />
        ),
      }),
      columnHelper.accessor("model_name", {
        id: "model_name",
        header: ({ column }) => <SortingHeader column={column} title="Model" />,
      }),
      columnHelper.accessor("location", {
        id: "location",
        header: ({ column }) => (
          <SortingHeader column={column} title="Location" />
        ),
      }),
      columnHelper.accessor("start_timestamp", {
        id: "status",
        header: "Status",
        cell: ({ getValue, row }) => {
          const currentUnixTime = Math.floor(Date.now() / 1000);
          const startUnixTime = getValue();
          const endUnixTime = row.original.end_timestamp;
          const status =
            startUnixTime <= currentUnixTime && endUnixTime >= currentUnixTime
              ? "Ongoing"
              : startUnixTime > currentUnixTime
              ? "Upcoming"
              : "Ended";

          return (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  status === "Ongoing"
                    ? "bg-green-600"
                    : status === "Upcoming"
                    ? "bg-orange-300"
                    : "bg-zinc-500"
                )}
              />
              <span className="capitalize">{status}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("start_timestamp", {
        id: "startAt",
        header: ({ column }) => (
          <SortingHeader column={column} title="Start At" />
        ),

        cell: ({ getValue }) => (
          <span>
            {format(getDateFromUnixTimestamp(getValue()), "yyyy-MM-dd HH:mm")}
          </span>
        ),
      }),
      columnHelper.accessor("end_timestamp", {
        id: "endAt",
        header: ({ column }) => (
          <SortingHeader column={column} title="End At" />
        ),
        cell: ({ getValue }) => (
          <span>
            {format(getDateFromUnixTimestamp(getValue()), "yyyy-MM-dd HH:mm")}
          </span>
        ),
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: "Description",
      }),
      columnHelper.accessor("$id", {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.dotsVerfical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DeleteScheduleDialog schedule={row.original} />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    []
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Schedules</h1>
        </div>
        <ScheduleForm
          trigger={
            <Button>
              <Icons.plus className="w-5 h-5 mr-2" />
              New Schedule
            </Button>
          }
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={isFetching}
        filterKey="name"
        onRefresh={refetch}
      />
    </div>
  );
}

export default ScheduleList;
