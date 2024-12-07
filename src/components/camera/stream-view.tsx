import { useRef, useState } from "react";
import PanelVideo from "../panel-video";
import PTZControl from "../ptz-control";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function StreamView({
  streamId,
  ptzActivated,
}: {
  streamId: string;
  ptzActivated?: boolean;
}) {
  const [ptz, setPtz] = useState(ptzActivated || false);
  const handle = useFullScreenHandle();
  const videoRef = useRef(null);

  return (
    <div>
      <FullScreen handle={handle}>
        <div
          className={cn("relative rounded-md  overflow-hidden", {
            "aspect-w-16 aspect-h-9": !handle.active,
            "h-full w-full": handle.active,
          })}
        >
          <PanelVideo streamId={streamId} ref={videoRef} />
          <div
            className={cn(
              "absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between"
            )}
          >
            <div />

            {ptz && <PTZControl streamId={streamId} />}

            <div className="flex justify-end items-end">
              <div className={cn("flex gap-3 p-5")}>
                {ptzActivated && (
                  <Button
                    className={cn(
                      "bg-opacity-60 bg-zinc-200 text-black rounded-full hover:text-white",
                      ptz && "bg-primary text-white"
                    )}
                    size="sm"
                    onClick={() => setPtz(!ptz)}
                  >
                    <Icons.control className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  className={cn(
                    "bg-opacity-60 bg-zinc-200 text-black rounded-full hover:text-white ",
                    handle.active && "bg-primary text-white"
                  )}
                  size="sm"
                  onClick={() =>
                    handle.active ? handle.exit() : handle.enter()
                  }
                >
                  <Icons.expand className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FullScreen>
    </div>
  );
}

export default StreamView;
