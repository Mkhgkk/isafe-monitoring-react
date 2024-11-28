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

function CameraDetail() {
  const { streamId } = useParams();
  const navigate = useNavigate();

  const { data: stream } = useQuery({
    queryKey: ["streamService.fetchStreamById", streamId],
    queryFn: () => streamService.fetchStreamByStreamId(streamId!),
    enabled: !!streamId,
  });

  return (
    <div className=" grid grid-cols-12 gap-4">
      <div className="col-span-12  pr-4 lg:col-span-9 lg:border-r">
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
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
              <p className="text-sm text-muted-foreground">
                {stream?.location}
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

        {streamId && <StreamView streamId={streamId} />}
      </div>

      <div className="col-span-12 lg:col-span-3">
        {streamId && <ScheduleEventList streamId={streamId} />}
      </div>
    </div>
  );
}

export default CameraDetail;
