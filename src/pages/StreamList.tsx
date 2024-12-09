import { streamService } from "@/api";
import { Icons } from "@/components/icons";
import ActivateDialog from "@/components/stream/activate-dialog";
import DeleteDialog from "@/components/stream/delete-dialog";
import StreamForm from "@/components/stream/stream-form";
import { Button } from "@/components/ui/button";
import { DataTable, SortingHeader } from "@/components/ui/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { streamModels } from "@/constants";
import { cn } from "@/lib/utils";
import { Stream } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { message } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PasswordCell = ({ value }: { value?: string }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!value) return null;
  return (
    <div className="flex items-center">
      <span className="mr-1 min-w-10">{showPassword ? value : "******"}</span>
      <Button
        variant="ghost"
        size="icon"
        className="p-0 w-8 h-8"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <Icons.eyeOff size={14} className="text-muted-foreground" />
        ) : (
          <Icons.eye size={14} className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

function StreamList() {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
    select: (data) => {
      const activeStreams: Stream[] = [];
      const inactiveStreams: Stream[] = [];

      data.forEach((stream) => {
        if (stream.is_active) {
          activeStreams.push(stream);
        } else {
          inactiveStreams.push(stream);
        }
      });

      return {
        activeCount: activeStreams.length,
        inactiveCount: inactiveStreams.length,
        rows: data,
      };
    },
  });

  const columnHelper = createColumnHelper<Stream>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("stream_id", {
        id: "index",
        header: "",
        cell: ({ row }) => <span className="pl-3">{row.index + 1}</span>,
      }),
      columnHelper.accessor("stream_id", {
        id: "name",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.id")} />
        ),
      }),
      columnHelper.accessor("model_name", {
        id: "model_name",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.model")} />
        ),
      }),
      columnHelper.accessor("location", {
        id: "location",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.location")} />
        ),
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.desc")} />
        ),
      }),
      columnHelper.accessor("is_active", {
        id: "status",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.status")} />
        ),
        cell: ({ getValue }) => {
          const status = getValue()
            ? t("monitoring.active")
            : t("monitoring.inactive");

          return (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  status === "active" ? "bg-green-600" : "bg-orange-600"
                )}
              />
              <span className="capitalize">{status}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("ptz_username", {
        id: "ptz_username",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.ptzUsername")} />
        ),
      }),
      columnHelper.accessor("ptz_password", {
        id: "ptz_password",
        header: t("stream.ptzPassword"),
        cell: ({ getValue }) => <PasswordCell value={getValue()} />,
      }),
      columnHelper.accessor("cam_ip", {
        id: "cam_ip",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.camIp")} />
        ),
      }),
      columnHelper.accessor("ptz_port", {
        id: "ptz_port",
        header: ({ column }) => (
          <SortingHeader column={column} title={t("stream.ptzPort")} />
        ),
      }),

      columnHelper.accessor("rtsp_link", {
        id: "rtsp_link",
        header: t("stream.rtspLink"),
        cell: ({ getValue }) => (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(getValue());
                    messageApi.open({
                      key: "updatable",
                      type: "success",
                      content: "Copied to clipboard!",
                      duration: 2,
                    });
                  }}
                >
                  <Icons.link size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getValue()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      }),

      columnHelper.accessor("", {
        id: "id",
        header: "",

        cell: ({ row }) => {
          const streamId = row.original.stream_id;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only"></span>
                  <Icons.dotsVerfical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => navigate("/cameras/" + streamId)}
                  disabled={!row.original.is_active}
                >
                  <Icons.preview className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
                  {t("common.view")}
                </DropdownMenuItem>
                <ActivateDialog
                  isActivated={!!row.original.is_active}
                  streamId={streamId}
                />

                <DropdownMenuItem
                  onSelect={() => navigate("/streams/hazard-area/" + streamId)}
                  disabled={!row.original.is_active}
                >
                  <Icons.hazard className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
                  {t("hazardArea.title")}
                </DropdownMenuItem>
                <Separator className="my-2" />
                <StreamForm
                  initialData={row.original}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Icons.edit className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
                      {t("common.edit")}
                    </DropdownMenuItem>
                  }
                />
                <DeleteDialog stream_id={streamId} />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    []
  );

  return (
    <div>
      {contextHolder}
      <div className="flex justify-between pb-4 items-center">
        <div>
          <h1 className="text-xl font-semibold">{t("stream.title")}</h1>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-600">{data?.activeCount}</span>{" "}
            {t("monitoring.active")} /{" "}
            <span className="text-orange-600">{data?.inactiveCount}</span>{" "}
            {t("monitoring.inactive")}
          </p>
        </div>
        <StreamForm
          trigger={
            <Button>
              <Icons.plus className="w-5 h-5 mr-2" />
              {t("stream.newStream")}
            </Button>
          }
        />
      </div>
      <DataTable
        //@ts-expect-error
        columns={columns}
        data={data?.rows ?? []}
        loading={isFetching}
        filters={[
          {
            label: t("stream.id"),
            key: t("stream.id").toLowerCase(),
            type: "text",
          },
          {
            label: t("stream.model"),
            key: t("stream.model").toLowerCase(),
            type: "select",
            options: [
              { label: t("common.all"), value: undefined },
              ...streamModels,
            ],
          },
        ]}
        onRefresh={() => refetch()}
      />
    </div>
  );
}

export default StreamList;
