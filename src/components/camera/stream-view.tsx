import { useState } from "react";
import PanelVideo from "../panel-video";
import PTZControl from "../ptz-control";
import StreamInfo from "../stream/stream-info";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { ScheduleDocument } from "@/type";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function StreamView({
  streamId,
  schedule,
}: {
  streamId: string;
  schedule?: ScheduleDocument;
}) {
  const [ptz, setPtz] = useState(true);
  const handle = useFullScreenHandle();

  // //need to get the stream detail
  // const { data: stream } = useQuery({
  //   queryKey: ["streamService.fetchStreamById", streamId],
  //   queryFn: () => streamService.fetchStreamById(streamId!),
  //   enabled: !!streamId,
  //   select: (data) => {
  //     setPtz(data?.support_ptz || false);
  //     return data;
  //   },
  // });

  return (
    <FullScreen handle={handle}>
      <div
        className={cn("relative rounded-md  overflow-hidden", {
          "aspect-w-16 aspect-h-9": !handle.active,
          "h-full w-full": handle.active,
        })}
      >
        <PanelVideo streamId={streamId} />
        <div
          className={cn(
            "absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between",
            {
              "p-10": handle.active,
            }
          )}
        >
          {/* <div className="py-1 px-3 bg-zinc-200  bg-opacity-60 rounded-2xl flex items-center m-5 self-end space-x-1.5">
          <div className="relative flex items-center justify-center h-3 w-3">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600" />
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-600 opacity-75" />
          </div>
          <p className="text-xs font-semibold text-black">Live</p>
        </div> */}
          <div />

          {ptz && <PTZControl streamId={streamId} />}

          <div className="flex justify-between items-end">
            {schedule && (
              <StreamInfo
                modelName={schedule?.model_name}
                cameraName={schedule?.stream_id}
                location={schedule?.location}
                bg
                className="static p-5"
              />
            )}
            <div className="flex gap-3">
              <Button
                className={cn(
                  "bg-opacity-60 bg-zinc-200 text-black rounded-full hover:text-white ",
                  ptz && "bg-primary text-white"
                )}
                size="sm"
                onClick={() => setPtz(!ptz)}
              >
                <Icons.control className="w-4 h-4" />
              </Button>
              <Button
                className={cn(
                  "bg-opacity-60 bg-zinc-200 text-black rounded-full hover:text-white ",
                  handle.active && "bg-primary text-white"
                )}
                size="sm"
                onClick={() => (handle.active ? handle.exit() : handle.enter())}
              >
                <Icons.expand className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
  );
}

export default StreamView;