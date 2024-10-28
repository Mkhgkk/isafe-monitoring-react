import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import EventCard, { EventCardSkeleton } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

import config from "../config/default.config";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { format } from "date-fns";
import { getDateFromUnixTimestamp } from "@/utils";

function EventDetail() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["eventService.fetchEventById", eventId],
    queryFn: () => eventService.fetchEventById(eventId!),
    enabled: !!eventId,
  });

  return (
    <div className="pb-4">
      <div className=" mb-4">
        <div className="flex items-center gap-2">
          <Icons.arrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-semibold">
            {data?.event?.title} ({data?.event?.stream_id} -{" "}
            {data?.event?.description})
          </h1>
        </div>

        {data?.event?.timestamp && (
          <p className="text-sm text-muted-foreground mt-1">
            Accured at{" "}
            {format(getDateFromUnixTimestamp(data.event.timestamp), "PPpp")}
          </p>
        )}
      </div>
      {isFetching ? (
        <Skeleton className="rounded-md w-full lg:max-w-5xl mb-5 aspect-[16/9]" />
      ) : (
        <div className="overflow-hidden rounded-md w-full lg:max-w-5xl mb-5">
          {data?.event?.video_filename && (
            <video
              src={`http://${config.BACKEND_URL}/video/videos/${data.event.video_filename}`}
              controls={true}
              autoPlay
              muted
              loop
              className="w-full"
            />
          )}
        </div>
      )}
      <Separator />
      <div className="mt-4">
        <h1 className="text-xl font-semibold mb-4">Related events</h1>
        {data?.related.length === 0 && !isFetching && (
          <p className="text-center">No related event.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {isFetching &&
            [0, 1, 2, 3].map((item) => (
              <EventCardSkeleton
                className="flex gap-2 w-[250px] border p-2 rounded-md"
                key={item}
              />
            ))}
          {data?.related.map((item) => (
            <EventCard
              className="flex gap-2 w-[250px] border p-2 rounded-md"
              key={item.$id}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
