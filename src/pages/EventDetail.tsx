import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

import config from "../config/default.config";
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { getDateFromUnixTimestamp } from "@/utils";

import { Event } from "@/type";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EventItem, { EventItemSkeleton } from "@/components/event/event-item";
import moment from "moment";

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
            {data?.reasons.length > 1 ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <h1 className="text-xl font-semibold">
                      {t(`eventCause.${data.reasons[0]}`)}
                      {` +${data.reasons.length - 1}`} ({data?.stream_id} -{" "}
                      {data?.model_name})
                    </h1>
                  </TooltipTrigger>
                  <TooltipContent className="grid gap-2" align="start">
                    {data.reasons.map((reason: string, index: number) => (
                      <p key={index} className="text-md">
                        {t(`eventCause.${reason}`)}
                      </p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <h1 className="text-xl font-semibold">
                {t(`eventCause.${data?.reasons[0]}`)} ({data?.stream_id} -{" "}
                {data?.model_name})
              </h1>
            )}
          </div>

          {data?.timestamp && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("event.accuredAt", {
                time: moment
                  .unix(data?.timestamp)
                  .format("yyyy-MM-DD HH:mm:ss"),
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
                src={`${config.PROTOCOL}//${config.BACKEND_URL}/video/${data.stream_id}/videos/${data.video_filename}`}
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
              <EventItemSkeleton
                className="flex gap-2 w-full border p-2 rounded-md"
                key={item}
              />
            ))}
          {relatedEvents?.data?.map((item: Event) => (
            <EventItem
              className="border p-2"
              key={item._id.$oid}
              item={item}
              simple
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
