import { Icons } from "@/components/icons";

import { useNavigate, useParams } from "react-router-dom";
import { streamService } from "@/api";

import { useQuery } from "@tanstack/react-query";
import StreamView from "@/components/camera/stream-view";
import ScheduleEventList from "@/components/camera/schedule-event-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ActivateDialog from "@/components/stream/activate-dialog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Contents from "@/components/contents";
import { Switch } from "@/components/ui/switch";

function CameraDetail() {
  const { streamId } = useParams();
  const navigate = useNavigate();

  const { data: stream } = useQuery({
    queryKey: ["streamService.fetchStreamById", streamId],
    queryFn: () => streamService.fetchStreamById(streamId!),
    enabled: !!streamId,
  });

  return (
    <>
      <div className=" grid grid-cols-12 gap-4">
        <div className="col-span-12 pr-4 lg:col-span-9 lg:border-r lg:h-[calc(100vh-32px)] overflow-y-scroll">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Icons.arrowLeft
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                />
                <h1 className="text-xl font-semibold">Monitoring</h1>
              </div>
              <div className="flex items-center mb-3">
                <span
                  className={cn("flex h-2 w-2 rounded-full mr-2", {
                    "bg-orange-600": !stream?.is_active,
                    "bg-green-600": stream?.is_active,
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  {stream?.stream_id} - {stream?.model_name} ({stream?.location}
                  )
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Icons.settings className="w-4 h-4 mr-2" />
                  Config
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ActivateDialog
                  isActivated={!!stream?.is_active}
                  streamId={streamId!}
                />

                <DropdownMenuItem
                  onSelect={() => navigate("/streams/hazard-area/" + streamId)}
                  disabled={!stream?.is_active}
                >
                  <Icons.hazard className="w-4 h-4 text-zinc-800 mr-2 dark:text-white" />
                  Set hazard area
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {streamId && stream?.is_active && (
            <StreamView
              streamId={streamId}
              ptzActivated={
                !!(
                  stream.ptz_port &&
                  stream.ptz_password &&
                  stream.ptz_username &&
                  stream.cam_ip
                )
              }
            />
          )}
          {!stream?.is_active && (
            <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 flex justify-center items-center  aspect-[16/9]">
              <Icons.offline className="opacity-30" size={50} />
            </div>
          )}
          <Separator className="my-5" />

          <div className="hidden lg:block">
            {streamId && <ScheduleEventList streamId={streamId} />}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="grid gap-4">
            <p className="text-xl font-semibold ">Detail</p>
            <div className="grid gap-3 bg-slate-100 dark:bg-slate-900 bg-opacity-75 p-3 rounded-md border">
              <Contents field={"Stream ID"} value={stream?.stream_id ?? "-"} />
              <Contents field={"Model"} value={stream?.model_name ?? "-"} />
              <Contents field={"Location"} value={stream?.location ?? "-"} />
              <Contents
                field={"Description"}
                value={stream?.description ?? "-"}
              />
            </div>

            <div className="grid gap-3 bg-slate-100 dark:bg-slate-900 bg-opacity-75 p-3 rounded-md border">
              <Contents field={"Saving Video"} value={<Switch />} />
              <Contents field={"Intrusion"} value={<Switch />} />
              <Contents field={"Inspect"} value={<Switch />} />
              <Contents field={"Alert"} value={<Switch />} />
              <Contents field={"Watch notification"} value={<Switch />} />
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <Separator className="my-5" />
        {streamId && <ScheduleEventList streamId={streamId} />}
      </div>
    </>
  );
}

export default CameraDetail;
