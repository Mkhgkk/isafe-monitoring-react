import { useRef, useState } from "react";
import WeekCalendar from "../week-calendar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { Event } from "@/type";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Empty from "../empty";
import EventItem, { EventItemSkeleton } from "../event/event-item";

const LIMIT = 20;
function ScheduleEventList({ streamId }: { streamId: string }) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "eventService.fetchEvents",
        { date: selectedDate, stream: streamId },
      ],
      queryFn: ({ pageParam = 0 }) =>
        eventService.fetchEvents(
          {
            dateRange: {
              from: moment(selectedDate).startOf("day").toDate(),
              to: moment(selectedDate).endOf("day").toDate(),
            },
            stream: streamId,
          },
          { page: pageParam, limit: LIMIT }
        ),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.length ? allPages.length : undefined;
      },
      initialPageParam: 0,
      enabled: !!streamId,
    });

  const events = data?.pages.flatMap((page) => page.data) as Event[];

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    scrollRef.current?.scrollTo(0, 0);
  };

  return (
    <div className="grid gap-y-4">
      {/* <div className="flex justify-between pb-2"> */}
      <p className="text-xl font-semibold">{t("event.title")}</p>
      <WeekCalendar
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
      />
      {/* </div> */}

      <div ref={scrollRef} className="h-[calc(100vh-145px)] overflow-y-scroll">
        <div className="grid gap-y-3 grid-cols-2 gap-2 ">
          {isLoading
            ? [0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                <EventItemSkeleton key={item} className="p-2" />
              ))
            : events?.map((item) => (
                <EventItem
                  item={item}
                  key={item._id.$oid}
                  className="border p-2"
                  simple
                  withoutDate
                />
              ))}

          {isFetchingNextPage && <EventItemSkeleton className="p-2" />}
        </div>

        {events?.length === 0 && !isLoading && (
          <Empty text={t("event.noResult")} className="h-[calc(100vh-185px)]" />
        )}
        <div ref={setTarget} className="h-[1rem]" />
      </div>
    </div>
  );
}

export default ScheduleEventList;

// export function EventItemSkeleton() {
//   return (
//     <div>
//       <Skeleton className="w-full rounded-sm aspect-[16/9] mb-2 border" />
//       <div>
//         <Skeleton className="h-5 w-20 mb-2 rounded-sm" />
//         <Skeleton className="h-3 w-28 rounded-sm mb-0.5" />
//         <Skeleton className="h-3 w-28" />
//       </div>
//     </div>
//   );
// }
