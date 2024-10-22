import { Icons } from "@/components/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import { eventService } from "@/api";
import { getThumbnailUrl } from "@/utils";
import { format } from "date-fns";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import ListFilter, { EventFilters } from "@/components/event/list-filter";
import { ScrollArea } from "@/components/ui/scroll-area";

function EventItemSkeleton() {
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

const LIMIT = 20;

export default function EventList() {
  const [filters, setFilters] = useState<EventFilters>({
    stream: undefined,
    type: undefined,
    date: undefined,
  });
  const navigate = useNavigate();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["eventService.fetchAllEvents", filters],
      queryFn: ({ pageParam = 0 }) =>
        eventService.fetchAllEvents(filters, { page: pageParam, limit: LIMIT }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length * LIMIT : undefined;
      },
      initialPageParam: 0,
    });

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const flatted = data?.pages.flatMap((page) => page);

  return (
    <div className="h-[calc(100vh-40px)]">
      <div className="flex justify-between items-center pb-5">
        <h1 className="text-xl font-semibold">Events</h1>
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
      <ScrollArea className="h-[calc(100vh-72px)]">
        {!isLoading && !flatted?.length && (
          <p className="text-muted-foreground text-center mt-[200px]">
            No events found.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5 flex-wrap">
          {isLoading &&
            !flatted?.length &&
            [...Array(8)].map((_, i) => <EventItemSkeleton key={i} />)}

          {flatted?.map((item) => (
            <div
              className="gap-2"
              onClick={() => navigate("/events/" + item.$id)}
            >
              <img
                src={getThumbnailUrl(item.thumbnail)}
                className="w-full rounded-sm aspect-[16/9]"
              />
              <div className="mt-1">
                <p className="font-semibold mb-1">{item.title}</p>
                <p className="text-xs text-zinc-500">
                  {item.stream_id} - {item.description}
                </p>
                <p className="text-xs text-zinc-500">
                  {format(item.$createdAt, "yyyy-MM-dd HH:mm:ss")}
                </p>
              </div>
            </div>
          ))}
          {isFetchingNextPage && <EventItemSkeleton />}

          <div ref={setTarget} className="h-[1rem]" />
        </div>
      </ScrollArea>
    </div>
  );
}
