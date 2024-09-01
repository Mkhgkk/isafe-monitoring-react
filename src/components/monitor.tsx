import * as React from "react";
import Cookies from "js-cookie";

import {
  Award,
  DownloadCloud,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

import Monitoring from "./monitoring";
import { Nav } from "./nav";
import { Label } from "./ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { TooltipProvider } from "./ui/tooltip";

import logo from "@/assets/logo.png";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Monitor({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const updateLayoutCookie = (sizes: number[]) => {
    Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
  };

  const updateCollapsedCookie = (collapsed: boolean) => {
    Cookies.set("react-resizable-panels:collapsed", JSON.stringify(collapsed));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          updateLayoutCookie(sizes);
        }}
        className="h-full max-h-[100vh] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            console.log("here", collapsed);
            setIsCollapsed(collapsed);
            updateCollapsedCookie(collapsed);
          }}
          className={cn(
            isCollapsed
              ? "min-w-[50px] transition-all duration-300 ease-in-out"
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
              <img src={logo} width={25} height={25} className="mx-3" />
              <Label className="font-semibold text-lg">iSafe guard</Label>
            </div>
            <Separator />
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Monitoring",
                  icon: LayoutDashboard,
                  variant: "default",
                },
                {
                  title: "Security Camera",
                  icon: ShieldCheck,
                  variant: "ghost",
                },
                {
                  title: "Update",
                  icon: DownloadCloud,
                  variant: "ghost",
                },
                {
                  title: "License",
                  icon: Award,
                  variant: "ghost",
                },
              ]}
            />
          </div>

          <div className="p-5 mb-4">
            <p className="text-muted-foreground text-xs">Server Connected</p>
            <p className="text-sm">Less than a minute ago</p>
            <p className="text-muted-foreground text-xs mt-3">Version</p>
            <p className="text-sm">10.1.1.3.9</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <ScrollArea className="h-screen">
            {/* <div className="p-4 gap-y-4 flex flex-col ">
              <Hero />
              <Summary />
            </div>
            <Separator /> */}
            <div className="p-4 gap-y-4 flex flex-col ">
              <Monitoring />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
