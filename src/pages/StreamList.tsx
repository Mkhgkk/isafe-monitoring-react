import { Icons } from "@/components/icons";
import AutoTrackDialog from "@/components/stream/autotrack-dialog";
import DeleteDialog from "@/components/stream/delete-dialog";
import PreviewDialog from "@/components/stream/preview-dialog";
import StreamForm from "@/components/stream/stream-form";
import { Button } from "@/components/ui/button";
import { DataTable, SortingHeader } from "@/components/ui/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppwrite } from "@/context/AppwriteContext";
import { cn } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { message } from "antd";
import React, { useEffect, useMemo, useState } from "react";

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
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { databases, appwriteClient } = useAppwrite();

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        "isafe-guard-db",
        "66f504260003d64837e5"
      );
      console.log(response.documents);
      setData(response.documents);
    } catch (err: any) {
      console.log("StreamList - Failed to get list of streams: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    const unsubscribe = appwriteClient.subscribe(
      "databases.isafe-guard-db.collections.66f504260003d64837e5.documents",
      (response) => {
        console.log("StreamList.tsx - Subscription returned data: ", response);
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setData((prevState) => [...prevState, response.payload]);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // handle delete
          setData((prevState) => [
            ...prevState.filter((item) => item.$id !== response.payload.$id),
          ]);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          // handle update
          setData((prevState) => {
            const index = prevState.findIndex(
              (item) => item.$id === response.payload.$id
            );
            const newState = [...prevState];
            newState[index] = response.payload;
            return newState;
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("$id", {
        id: "id",
        header: "",
        cell: ({ row }) => <span className="pl-3">{row.index + 1}</span>,
      }),
      columnHelper.accessor("stream_id", {
        id: "name",
        header: ({ column }) => <SortingHeader column={column} title="Name" />,
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: ({ column }) => (
          <SortingHeader column={column} title="Description" />
        ),
      }),
      columnHelper.accessor("is_active", {
        id: "status",
        header: ({ column }) => (
          <SortingHeader column={column} title="Status" />
        ),
        cell: ({ getValue }) => {
          const status = getValue() ? "active" : "inactive";

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
      // columnHelper.accessor("location", {
      //   id: "location",
      //   header: ({ column }) => (
      //     <SortingHeader column={column} title="Location" />
      //   ),
      // }),
      columnHelper.accessor("ptz_username", {
        id: "ptz_username",
        header: ({ column }) => (
          <SortingHeader column={column} title="PTZ username" />
        ),
      }),
      columnHelper.accessor("ptz_password", {
        id: "ptz_password",
        header: "PTZ Password",
        cell: ({ getValue }) => <PasswordCell value={getValue()} />,
      }),
      columnHelper.accessor("cam_ip", {
        id: "cam_ip",
        header: ({ column }) => (
          <SortingHeader column={column} title="Cam IP" />
        ),
      }),
      columnHelper.accessor("ptz_port", {
        id: "ptz_port",
        header: ({ column }) => (
          <SortingHeader column={column} title="PTZ Port" />
        ),
      }),

      columnHelper.accessor("rtsp_link", {
        id: "rtsp_link",
        header: "RTSP Link",
        cell: ({ getValue }) => (
          <TooltipProvider>
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
      columnHelper.accessor("preview", {
        id: "preview",
        header: "",
      }),
      columnHelper.accessor("action", {
        id: "id",
        header: "",

        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Icons.dotsVerfical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <PreviewDialog
                  url={row.original.link}
                  streamId={row.original.id}
                  name={row.original.name}
                />
                <AutoTrackDialog
                  url={row.original.link}
                  streamId={row.original.id}
                  name={row.original.name}
                />
                <StreamForm
                  initialData={row.original}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Icons.edit className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
                <DeleteDialog
                  $id={row.original.$id}
                  stream_id={row.original.stream_id}
                />
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
          <h1 className="text-xl font-semibold">Streams</h1>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-600">2</span> Active /{" "}
            <span className="text-orange-600">6</span> Inactive
          </p>
        </div>
        <StreamForm
          trigger={
            <Button>
              <Icons.plus className="w-5 h-5 mr-2" />
              New Stream
            </Button>
          }
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        fetchFn={fetchStreams}
        loading={loading}
        filterKey="name"
        onRefresh={() => console.log("refresh")}
      />
    </div>
  );
}

export default StreamList;
