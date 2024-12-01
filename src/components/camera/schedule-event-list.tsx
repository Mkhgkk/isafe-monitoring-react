import { useRef, useState } from "react";
import EventCard, { EventCardSkeleton } from "../event-card";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
import WeekCalendar from "../week-calendar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { Event } from "@/type";
import { Skeleton } from "../ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import moment from "moment";

const LIMIT = 20;
function ScheduleEventList({ streamId }: { streamId: string }) {
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
    <div>
      <div className="flex justify-between items-center pb-4">
        <p className="text-xl font-semibold">Event</p>
        {/* <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>

              <SelectItem value="1">Security</SelectItem>
              <SelectItem value="2">camera 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
      <WeekCalendar
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
      />
      <div className="max-h-[80vh] overflow-scroll" ref={scrollRef}>
        <div className="grid gap-y-3">
          {isLoading
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <EventCardSkeleton key={item} />
              ))
            : events?.map((item) => (
                <EventCard item={item} key={item._id.$oid} />
              ))}

          {events?.length === 0 && !isLoading && (
            <p className="text-muted-foreground text-center mt-10 text-sm">
              No events found.
            </p>
          )}
          {isFetchingNextPage && <EventCardSkeleton />}
        </div>

        <div ref={setTarget} className="h-[1rem]" />
      </div>
    </div>
  );
}

export default ScheduleEventList;

export function EventItemSkeleton() {
  return (
    <div>
      <Skeleton className="w-full rounded-sm aspect-[16/9] mb-2 border" />
      <div>
        <Skeleton className="h-5 w-20 mb-2 rounded-sm" />
        <Skeleton className="h-3 w-28 rounded-sm mb-0.5" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
