import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigate, Outlet } from "react-router-dom";
import { Models } from "appwrite";
import { useConnectionContext } from "@/context/ConnectionContext";
import { authService } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ImperativePanelHandle } from "react-resizable-panels";
import SideBar from "@/components/side-bar";
import { message } from "antd";
import socket from "@/services/socketService";

export const MainLayout = () => {
  //Why do you need this?
  const { setIsConnected: setIsConnectedContext } = useConnectionContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [systemStatus, setSystemStatus] = useState({ cpu: 0.0, gpu: 0.0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      messageApi.open({
        key: "updatable",
        type: "loading",
        content: "Connecting...",
        duration: 0,
      });
    }

    if (isConnected) {
      messageApi.open({
        key: "updatable",
        type: "success",
        content: "Connected!",
        duration: 2,
      });
    }
    setIsConnectedContext(isConnected);
  }, [isConnected]);

  useEffect(() => {
    messageApi.open({
      key: "updatable",
      type: "loading",
      content: "Connecting...",
      duration: 0,
    });

    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket server disconnected");
    });

    socket.on("system_status", (data) => {
      setSystemStatus(data);
    });

    return () => {
      socket.off("connect");
      socket.off("system_status");
      socket.disconnect();
    };
  }, []);

  const { data: user, isFetching } = useQuery({
    queryKey: ["authService.getMe"],
    queryFn: authService.getMe,
    retry: 0,
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return user ? (
    <>
      {contextHolder}
      <Layout
        user={user}
        isConnected={isConnected}
        systemStatus={systemStatus}
      />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

interface LayoutProps {
  systemStatus: { cpu: number; gpu: number };
  isConnected: boolean;
  user: Models.User<object>;
}

function Layout({ systemStatus, isConnected, user }: LayoutProps) {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const defaultLayout = [265, 1000];
  const [isCollapsed, setIsCollapsed] = useState(
    Cookies.get("collapsed") === "true" || false
  );

  const updateCollapsedCookie = (value: boolean) => {
    Cookies.set("collapsed", `${value}`);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          <SideBar
            isCollapsed={isCollapsed}
            isConnected={isConnected}
            systemStatus={systemStatus}
            user={user}
          />
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
