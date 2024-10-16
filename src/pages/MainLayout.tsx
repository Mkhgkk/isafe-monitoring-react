import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  Settings,
  LayoutDashboard,
  ShieldCheck,
  TvMinimalPlay,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Nav } from "@/components/nav";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
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
import { useAppwrite } from "../context/AppwriteContext";
import { Client, Account, Models } from "appwrite";
import logo from "@/assets/logoBlack.png";
import { useConnectionContext } from "@/context/ConnectionContext";

interface SystemStatus {
  cpu: number;
  gpu: number;
}

interface MainLayoutProps {
  isConnected: boolean;
  systemStatus: SystemStatus;
  // user: Models.User<object>;
}

export const MainLayout = (props: MainLayoutProps) => {
  const [user, setUser] = useState<Models.User<object> | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { account } = useAppwrite();
  const navigate = useNavigate();

  const { setIsConnected } = useConnectionContext();

  useEffect(() => {
    setIsConnected(props.isConnected);
  }, [props.isConnected, setIsConnected]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await account.get<Models.User<object>>();
        setUser(response);
        console.log("main layout", response);
      } catch (error) {
        console.error("No user logged in", error);
        navigate("/login");
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchUser();
  }, [account, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking user
  }

  return user ? <Layout user={user} {...props} /> : <Navigate to="/login" />;
};
interface LayoutProps {
  user: Models.User<object>;
}

function Layout({
  systemStatus,
  isConnected,
  user,
}: MainLayoutProps & LayoutProps) {
  const panelRef = React.useRef();
  const defaultLayout = [265, 1000];
  const [isCollapsed, setIsCollapsed] = React.useState(
    Cookies.get("collapsed") === "true" || false
  );
  const { pathname } = useLocation();
  const { account } = useAppwrite();
  const navigate = useNavigate();

  const updateCollapsedCookie = (value: boolean) => {
    Cookies.set("collapsed", `${value}`);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        panelRef.current?.collapse();
      } else {
        panelRef.current?.expand();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ConnectionInfo = () => (
    <>
      {isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-600 mr-2"></span>
          Server Connected
        </p>
      )}
      {!isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-600 mr-2"></span>
          Server Disconnected
        </p>
      )}
      <p className="text-sm">Less than a minute ago</p>
      <p className="text-muted-foreground text-xs mt-3">System Utilization</p>
      <p className="text-sm">CPU: {systemStatus.cpu.toFixed(1)}%</p>
      <p className="text-sm">GPU: {systemStatus.gpu.toFixed(1)}%</p>
    </>
  );

  const handleLogout = async () => {
    // console.log("handle logout");
    // console.log(user);
    try {
      const result = await account.deleteSession(
        "current" // sessionId
      );
      console.log(result);
      navigate("/login");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[100vh] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={4}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            updateCollapsedCookie(collapsed);
          }}
          ref={panelRef}
          className={cn(
            isCollapsed
              ? "min-w-[50px] transition-all duration-300 ease-in-out flex flex-col justify-between"
              : "flex flex-col justify-between"
          )}
        >
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
              links={[
                {
                  title: "Monitoring",
                  icon: LayoutDashboard,
                  variant: pathname.includes("/cameras") ? "default" : "ghost",
                  href: "/cameras",
                },
                {
                  title: "Security Cameras",
                  icon: ShieldCheck,
                  variant: pathname.includes("/streams") ? "default" : "ghost",
                  href: "/streams",
                },
                {
                  title: "Saved Events",
                  icon: TvMinimalPlay,
                  variant: pathname.includes("/events") ? "default" : "ghost",
                  href: "/events",
                },
                {
                  title: "Settings",
                  icon: Settings,
                  variant: pathname.includes("/setting") ? "default" : "ghost",
                  href: "/setting",
                },
              ]}
            />
          </div>

          <div>
            <div className={cn("p-5 ", isCollapsed && "hidden")}>
              <ConnectionInfo />
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
                <ConnectionInfo />
              </PopoverContent>
            </Popover>
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
                    <AvatarImage
                      // src="https://github.com/shadcn.png"
                      src={undefined}
                    />
                    <AvatarFallback>
                      <Icons.user className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Label className={cn(isCollapsed && "hidden")}>
                    {user && user.name}
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <ScrollArea className="h-screen">
            <div className="p-4 gap-y-4 flex flex-col ">
              <Outlet />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
