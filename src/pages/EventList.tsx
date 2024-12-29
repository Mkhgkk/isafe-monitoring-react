import { Icons } from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import ListFilter, { EventFilters } from "@/components/event/list-filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventItem, { EventItemSkeleton } from "@/components/event/event-item";
import { Event } from "@/type";
import { useTranslation } from "react-i18next";
import Empty from "@/components/empty";

const LIMIT = 20;

export default function EventList() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<EventFilters>({
    stream: undefined,
    dateRange: { from: undefined, to: undefined },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["eventService.fetchEvents", filters],
      queryFn: ({ pageParam = 0 }) =>
        eventService.fetchEvents(filters, { page: pageParam, limit: LIMIT }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.length ? allPages.length : undefined;
      },
      initialPageParam: 0,
    });

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const flatted = data?.pages.flatMap((page) => page.data) as Event[];

  return (
    <div className="h-[calc(100vh-85px)] p-4">
      <div className="flex justify-between items-center pb-5">
        <h1 className="text-xl font-semibold">{t("event.title")}</h1>
        <div className="gap-2 hidden lg:flex">
          <ListFilter filters={filters} setFilters={setFilters} />
        </div>
        <Popover>
          <PopoverTrigger className="lg:hidden">
            <Button size="icon" className="w-9 h-9" variant="outline">
              <Icons.filter size={15} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-y-2">
              <ListFilter filters={filters} setFilters={setFilters} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="h-[calc(100vh-105px)]">
        {!isLoading && !flatted?.length && (
          <Empty text={t("event.noResult")} className="h-[calc(100vh-105px)]" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5 flex-wrap">
          {isLoading &&
            !flatted?.length &&
            [...Array(8)].map((_, i) => <EventItemSkeleton key={i} />)}

          {flatted?.map((item, index) => (
            <EventItem item={item} key={index} />
          ))}
          {isFetchingNextPage && <EventItemSkeleton />}

          <div ref={setTarget} className="h-[1rem]" />
        </div>
      </ScrollArea>
    </div>
  );
}
