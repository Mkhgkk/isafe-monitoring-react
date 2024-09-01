import * as React from "react";
import Cookies from "js-cookie";

import {
  Award,
  DownloadCloud,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

import Monitoring from "@/components/monitoring";
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
import { Outlet } from "react-router-dom";

// interface Props {
//   defaultLayout: number[] | undefined;
//   defaultCollapsed?: boolean;
//   navCollapsedSize: number;
// }

export function MainLayout() {
  const defaultLayout = [265, 440, 655];
  const defaultCollapsed = false;
  const isCollapsed = false;
  //   defaultLayout = [265, 440, 655],
  //   defaultCollapsed = false,
  //   navCollapsedSize,
  // }: Props
  //   const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  //   const updateLayoutCookie = (sizes: number[]) => {
  //     Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
  //   };

  //   const updateCollapsedCookie = (collapsed: boolean) => {
  //     Cookies.set("react-resizable-panels:collapsed", JSON.stringify(collapsed));
  //   };

  //   const [defaultLayout, setDefaultLayout] = useState(undefined);
  //   const [defaultCollapsed, setDefaultCollapsed] = useState(undefined);

  //   useEffect(() => {
  //     const layout = Cookies.get("react-resizable-panels:layout");
  //     const collapsed = Cookies.get("react-resizable-panels:collapsed");

  //     if (layout) {
  //       try {
  //         setDefaultLayout(JSON.parse(layout));
  //       } catch (error) {
  //         console.error("Error parsing layout cookie:", error);
  //       }
  //     }

  //     if (collapsed) {
  //       try {
  //         setDefaultCollapsed(JSON.parse(collapsed));
  //       } catch (error) {
  //         console.error("Error parsing collapsed cookie:", error);
  //       }
  //     }
  //   }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          //   updateLayoutCookie(sizes);
        }}
        className="h-full max-h-[100vh] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={4}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            // setIsCollapsed(collapsed);
            // updateCollapsedCookie(collapsed);
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
              <img
                src="src/assets/logo.png"
                width={25}
                height={25}
                className="mx-3"
              />
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
            <div className="p-4 gap-y-4 flex flex-col ">
              <Outlet />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
