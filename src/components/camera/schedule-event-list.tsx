import { useEffect, useState } from "react";
import EventCard, { EventCardSkeleton } from "../event-card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import WeekCalendar from "../week-calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/api";
import { useAppwrite } from "@/context/AppwriteContext";
import { EventDocument } from "@/type";
import { Skeleton } from "../ui/skeleton";

function ScheduleEventList({ streamId }: { streamId: string }) {
  const { appwriteClient } = useAppwrite();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: events, isFetching } = useQuery({
    queryKey: ["eventService.fetchEvents", streamId],
    queryFn: () => eventService.fetchEvents(streamId!),
    enabled: !!streamId,
  });

  useEffect(() => {
    const unsubscribe = appwriteClient.subscribe(
      "databases.isafe-guard-db.collections.670d337f001f9ab7ff34.documents",
      (response) => {
        const payload = response.payload as EventDocument;

        if (payload.stream_id !== streamId) return;

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          queryClient.setQueryData(
            ["eventService.fetchEvents", streamId],
            (oldData) => {
              return [payload, ...((oldData as EventDocument[]) || [])];
            }
          );
          return;
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          queryClient.setQueryData(
            ["eventService.fetchEvents", streamId],
            (oldData) => {
              return ((oldData as EventDocument[]) || []).filter(
                (item) => item.$id !== payload.$id
              );
            }
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pb-4">
        <p className="text-xl font-semibold">Event</p>
        <Select onValueChange={setFilter} value={filter}>
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
        </Select>
      </div>
      <WeekCalendar />
      <ScrollArea className="h-[80vh]">
        <div className="grid gap-y-3">
          {isFetching
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <EventCardSkeleton key={item} />
              ))
            : events?.map((item) => <EventCard item={item} key={item.$id} />)}

          {events?.length === 0 && !isFetching && (
            <p className="text-muted-foreground text-center mt-10 text-sm">
              No events found.
            </p>
          )}
        </div>
      </ScrollArea>
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
