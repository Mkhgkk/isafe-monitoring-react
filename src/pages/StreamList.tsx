import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SortingHeader } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { message } from "antd";
import { ArrowUpDown } from "lucide-react";
import React, { useMemo, useState } from "react";

const data = [
  {
    id: "1", //string unique
    name: "Stream2", //string,
    description: "Labaratory camear", //string?
    status: "active", // "active" | "inactive"
    ptzPassword: "1234", //string?
    ptzUsername: "usernmae1", //string?
    ptzPort: 8080, //number?
    ptzIp: "0.0.0.1", //string?
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "2",
    name: "Stream1",
    description: "Warehouse camera",
    status: "inactive",
    ptzPassword: "5678",
    ptzUsername: "username2",
    ptzPort: 8081,
    ptzIp: "0.0.0.2",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "3",
    name: "Stream3",
    description: "Parking lot camera",
    status: "active",
    ptzPassword: "abcd",
    ptzUsername: "username3",
    ptzPort: 8082,
    ptzIp: "0.0.0.3",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "4",
    name: "Stream4",
    description: "Lobby camera",
    status: "active",
    ptzPassword: "efgh",
    ptzUsername: "username4",
    ptzPort: 8083,
    ptzIp: "0.0.0.4",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "5",
    name: "Stream5",
    description: "Office camera",
    status: "inactive",
    ptzPassword: "ijkl",
    ptzUsername: "username5",
    ptzPort: 8084,
    ptzIp: "0.0.0.5",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "6",
    name: "Stream6",
    description: "Conference room camera",
    status: "active",
    ptzPassword: "mnop",
    ptzUsername: "username6",
    ptzPort: 8085,
    ptzIp: "0.0.0.6",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "7",
    name: "Stream7",
    description: "Entrance camera",
    status: "inactive",
    ptzPassword: "qrst",
    ptzUsername: "username7",
    ptzPort: 8086,
    ptzIp: "0.0.0.7",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "8",
    name: "Stream8",
    description: "Loading dock camera",
    status: "active",
    ptzPassword: "uvwx",
    ptzUsername: "username8",
    ptzPort: 8087,
    ptzIp: "0.0.0.8",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "9",
    name: "Stream9",
    description: "Hallway camera",
    status: "inactive",
    ptzPassword: "yzab",
    ptzUsername: "username9",
    ptzPort: 8088,
    ptzIp: "0.0.0.9",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "10",
    name: "Stream10",
    description: "Breakroom camera",
    status: "active",
    ptzPassword: "cdef",
    ptzUsername: "username10",
    ptzPort: 8089,
    ptzIp: "0.0.0.10",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "11",
    name: "Stream11",
    description: "Cafeteria camera",
    status: "inactive",
    ptzPassword: "ghij",
    ptzUsername: "username11",
    ptzPort: 8090,
    ptzIp: "0.0.0.11",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "12",
    name: "Stream12",
    description: "Staircase camera",
    status: "active",
    ptzPassword: "klmn",
    ptzUsername: "username12",
    ptzPort: 8091,
    ptzIp: "0.0.0.12",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "13",
    name: "Stream13",
    description: "Elevator camera",
    status: "inactive",
    ptzPassword: "opqr",
    ptzUsername: "username13",
    ptzPort: 8092,
    ptzIp: "0.0.0.13",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "14",
    name: "Stream14",
    description: "Backdoor camera",
    status: "active",
    ptzPassword: "stuv",
    ptzUsername: "username14",
    ptzPort: 8093,
    ptzIp: "0.0.0.14",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
  {
    id: "15",
    name: "Stream15",
    description: "Storage room camera",
    status: "inactive",
    ptzPassword: "wxyz",
    ptzUsername: "username15",
    ptzPort: 8094,
    ptzIp: "0.0.0.15",
    link: "https://www.youtube.com/watch?v=3v1n1v5Z2Z4",
  },
];

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
  const columnHelper = createColumnHelper();
  const [messageApi, contextHolder] = message.useMessage();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        header: "",
        cell: ({ row }) => <span className="pl-3">{row.index + 1}</span>,
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: ({ column }) => <SortingHeader column={column} title="Name" />,
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: ({ column }) => (
          <SortingHeader column={column} title="Description" />
        ),
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: ({ column }) => (
          <SortingHeader column={column} title="Status" />
        ),
        cell: ({ getValue }) => {
          const status = getValue();

          return (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  status === "active" ? "bg-green-600" : "bg-orange-600"
                )}
              />
              <span className="capitalize">{status}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("ptzUsername", {
        id: "ptzUsername",
        header: ({ column }) => (
          <SortingHeader column={column} title="Username" />
        ),
      }),
      columnHelper.accessor("ptzPassword", {
        id: "ptzPassword",
        header: "Password",
        cell: ({ getValue }) => <PasswordCell value={getValue()} />,
      }),
      columnHelper.accessor("ptzIp", {
        id: "ptzIp",
        header: ({ column }) => <SortingHeader column={column} title="IP" />,
      }),
      columnHelper.accessor("ptzPort", {
        id: "ptzPort",
        header: ({ column }) => <SortingHeader column={column} title="Port" />,
      }),

      columnHelper.accessor("link", {
        id: "link",
        header: "Link",
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
                <DropdownMenuItem>Preview</DropdownMenuItem>
                <DropdownMenuItem>Configure PTZ</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Delete
                </DropdownMenuItem>
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
        <h1 className="text-xl font-semibold">Streams</h1>
        <Button>New Stream</Button>
      </div>
      <DataTable columns={columns} data={data} filterKey="name" />
    </div>
  );
}

export default StreamList;
