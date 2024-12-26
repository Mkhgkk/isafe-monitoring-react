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
import { useConnectionContext } from "@/context/ConnectionContext";
import { ImperativePanelHandle } from "react-resizable-panels";
import SideBar from "@/components/side-bar";
import { message } from "antd";
import socket from "@/services/socketService";
import { useTranslation } from "react-i18next";

export const MainLayout = () => {
  const { t } = useTranslation();
  const { setIsConnected: setIsConnectedContext } = useConnectionContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [systemStatus, setSystemStatus] = useState({ cpu: 0.0, gpu: 0.0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      messageApi.open({
        key: "updatable",
        type: "loading",
        content: t("common.connecting"),
        duration: 0,
      });
    }

    if (isConnected) {
      messageApi.open({
        key: "updatable",
        type: "success",
        content: t("common.connected"),
        duration: 2,
      });
    }
    setIsConnectedContext(isConnected);
  }, [isConnected]);

  useEffect(() => {
    messageApi.open({
      key: "updatable",
      type: "loading",
      content: t("common.connecting"),
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

  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  return token && refreshToken ? (
    <>
      {contextHolder}
      <Layout isConnected={isConnected} systemStatus={systemStatus} />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

interface LayoutProps {
  systemStatus: { cpu: number; gpu: number };
  isConnected: boolean;
}

function Layout({ systemStatus, isConnected }: LayoutProps) {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const defaultLayout = 100;
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
      <div className="max-h-[100vh] flex flex-col">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 items-stretch"
        >
          <ResizablePanel
            defaultSize={isCollapsed ? 4 : defaultLayout}
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
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <ScrollArea className="h-screen">
              <div className="p-4 gap-y-4 flex flex-col ">
                <Outlet />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="h-[30px] px-4 border-t flex items-center">
          <p className="text-xs text-muted-foreground">Version: 0.0.0</p>
        </div>
      </div>
    </TooltipProvider>
  );
}
