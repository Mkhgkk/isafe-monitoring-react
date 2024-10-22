import { Icons } from "@/components/icons";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { scheduleService } from "@/api";

import { useQuery } from "@tanstack/react-query";
import StreamView from "@/components/camera/stream-view";
import ScheduleEventList from "@/components/camera/schedule-event-list";

function CameraDetail() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const { data: schedule } = useQuery({
    queryKey: ["scheduleService.fetchScheduleById", scheduleId],
    queryFn: () => scheduleService.fetchScheduleById(scheduleId!),
    enabled: !!scheduleId,
  });

  return (
    <div className=" grid grid-cols-12 gap-4">
      <div className="col-span-12  pr-4 lg:col-span-9 lg:border-r">
        <div className="flex items-center gap-2">
          <Icons.arrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-semibold">Monitoring</h1>
        </div>
        <div className="flex items-center mb-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
          <p className="text-sm text-muted-foreground">{schedule?.location}</p>
        </div>

        {streamId && <StreamView streamId={streamId} schedule={schedule} />}
      </div>

      <div className="col-span-12 lg:col-span-3">
        {streamId && <ScheduleEventList streamId={streamId} />}
      </div>
    </div>
  );
}

export default CameraDetail;
