import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Nav } from "./nav";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LayoutDashboard, TvMinimalPlay, Cctv } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ConnectionInfo from "./connection-info";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/api";
import NotificationPanel from "./notification-panel";

type SideBarProps = {
  isCollapsed: boolean;
  isConnected: boolean;
  systemStatus: { cpu: number; gpu: number };
};

const links = [
  {
    title: "Monitoring",
    icon: LayoutDashboard,
    href: "/cameras",
  },
  // {
  //   title: "Schedules",
  //   icon: CalendarRange,
  //   href: "/schedules",
  // },
  {
    title: "Streams",
    icon: Cctv,
    href: "/streams",
  },
  {
    title: "Saved Events",
    icon: TvMinimalPlay,
    href: "/events",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/setting",
  },
];

function SideBar({ isCollapsed, isConnected, systemStatus }: SideBarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["authService.getMe"],
    queryFn: authService.getMe,
  });
  const { mutate: logout } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div>
        <div
          className={cn(
            "flex h-[52px] items-center",
            isCollapsed ? "h-[52px]" : "px-2"
          )}
        >
          <img
            src={logo}
            width={25}
            height={25}
            className={cn(isCollapsed ? "mx-auto" : "mx-3")}
          />
          <Label
            className={cn(
              "font-semibold text-lg line-clamp-1",
              isCollapsed && "hidden"
            )}
          >
            iSafe Guard
          </Label>
        </div>
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={links.map((link) => ({
            ...link,
            variant: pathname.includes(link.href) ? "default" : "ghost",
          }))}
        />
      </div>

      <div>
        <div className={cn("p-5 ", isCollapsed && "hidden")}>
          <ConnectionInfo
            isConnected={isConnected}
            systemStatus={systemStatus}
          />
        </div>
        <Popover>
          <PopoverTrigger className={cn(isCollapsed ? "w-full" : "hidden")}>
            <Button
              size="icon"
              variant={"ghost"}
              className="h-9 w-9 mb-2 mx-auto"
            >
              <div className="flex h-3 w-3 relative">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isConnected ? "bg-green-600" : "bg-orange-600"
                  )}
                ></span>
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-3 w-3",
                    isConnected ? "bg-green-600" : "bg-orange-600"
                  )}
                ></span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right">
            <ConnectionInfo
              isConnected={isConnected}
              systemStatus={systemStatus}
            />
          </PopoverContent>
        </Popover>
        <NotificationPanel
          trigger={
            <Button
              variant="ghost"
              className={cn(
                "gap-3 w-full justify-start px-5 border-t h-14 rounded-none",
                isCollapsed && "justify-center"
              )}
              size={"sm"}
            >
              <div className="relative">
                <Icons.bell className="h-4 w-4" />
                <div className="w-2 h-2 bg-red-500 absolute rounded-full -top-1 right-0" />
              </div>
              <span className={cn(isCollapsed && "hidden")}>Notifications</span>
            </Button>
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "border-t w-full gap-3 rounded-none h-14",
                !isCollapsed && "px-4 justify-start"
              )}
              size={"sm"}
            >
              <Avatar className="w-7 h-7">
                <AvatarImage src={undefined} />
                <AvatarFallback>
                  <Icons.user className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Label className={cn(isCollapsed && "hidden")}>
                {user?.username}
              </Label>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right">
            <DropdownMenuItem onSelect={handleLogout}>
              <Icons.logout className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default SideBar;
