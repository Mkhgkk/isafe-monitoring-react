import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

import config from "../config/default.config";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { format } from "date-fns";
import { getDateFromUnixTimestamp } from "@/utils";
import EventCard, { EventCardSkeleton } from "@/components/event-card";
import { Event } from "@/type";
import { useTranslation } from "react-i18next";

function EventDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["eventService.fetchEventById", eventId],
    queryFn: () => eventService.fetchEventById(eventId!),
    enabled: !!eventId,
  });

  const { data: relatedEvents, isFetching: isFetchingRelated } = useQuery({
    queryKey: [
      "eventService.fetchEvents",
      {
        stream: data?.stream_id,
        start_timestamp: data?.timestamp - 60 * 60 * 1000,
        dateRange: {
          from: getDateFromUnixTimestamp(data?.timestamp - 60 * 60 * 1000),
          to: getDateFromUnixTimestamp(data?.timestamp + 60 * 60 * 1000),
        },
      },
    ],
    queryFn: () =>
      eventService.fetchEvents(
        {
          stream: data?.stream_id,
          dateRange: {
            from: getDateFromUnixTimestamp(data?.timestamp - 60 * 60 * 1000),
            to: getDateFromUnixTimestamp(data?.timestamp + 60 * 60 * 1000),
          },
        },
        { page: 0, limit: 4 }
      ),
    enabled: !!data?.stream_id,
  });

  return (
    <div className="max-h-[calc(100vh-30px)] overflow-y-scroll">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Icons.arrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <h1 className="text-xl font-semibold">
              {data?.title} ({data?.stream_id} - {data?.description})
            </h1>
          </div>

          {data?.timestamp && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("event.accuredAt", {
                time: format(getDateFromUnixTimestamp(data.timestamp), "PPpp"),
              })}
            </p>
          )}
        </div>
        {isFetching ? (
          <Skeleton className="mx-auto rounded-md w-full lg:max-w-5xl aspect-[16/9]" />
        ) : (
          <div className="mx-auto overflow-hidden rounded-md w-full lg:max-w-5xl">
            {data?.video_filename && (
              <video
                src={`${config.PROTOCOL}//${config.BACKEND_URL}/video/videos/${data.video_filename}`}
                controls={true}
                autoPlay
                muted
                loop
                className="w-full"
              />
            )}
          </div>
        )}
      </div>
      <Separator />
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">
          {t("event.relatedEvent")}
        </h1>
        {relatedEvents?.data?.length === 0 && !isFetchingRelated && (
          <p className="text-center">{t("event.noRelated")}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {isFetchingRelated &&
            [0, 1, 2, 3].map((item) => (
              <EventCardSkeleton
                className="flex gap-2 w-full border p-2 rounded-md"
                key={item}
              />
            ))}
          {relatedEvents?.data?.map((item: Event) => (
            <EventCard
              className="flex gap-2 w-full border p-2 rounded-md"
              key={item._id.$oid}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
