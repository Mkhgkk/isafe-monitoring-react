import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { scheduleService } from "@/api";
import StreamInfo from "@/components/stream/stream-info";
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleDocument } from "@/type";
import { useQuery } from "@tanstack/react-query";

export default function MainPage() {
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["scheduleService.fetchSchedules"],
    queryFn: scheduleService.fetchSchedules,
    select: (data) => {
      const currentTime = Math.floor(Date.now() / 1000);
      const ongoingSchedules: ScheduleDocument[] = [];
      const upcomingSchedules: ScheduleDocument[] = [];

      data.forEach((schedule) => {
        if (schedule.start_timestamp < currentTime) {
          ongoingSchedules.push(schedule as ScheduleDocument);
        } else {
          upcomingSchedules.push(schedule as ScheduleDocument);
        }
      });

      return { ongoingSchedules, upcomingSchedules };
    },
  });

  return (
    <div className="">
      <div className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">Monitoring</h1>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-600">
                {data?.ongoingSchedules.length}
              </span>{" "}
              Ongoing / {data?.upcomingSchedules.length} Upcoming
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="bg-muted hover:bg-muted-foreground"
          >
            <Icons.refresh className="mr-2 w-4 h-4 " />
            Refresh
          </Button>
        </div>
        <div className="border p-4 rounded-md">
          <p className="mb-5 font-semibold text-lg ">Ongoing</p>
          {isFetching && <Skeletons />}
          {!isFetching && !data?.ongoingSchedules?.length && (
            <p className="text-sm text-muted-foreground mb-4 text-center">
              No ongoing schedule.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.ongoingSchedules.map((item, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden w-full aspect-[16/9]"
                onClick={() =>
                  navigate(`/cameras/${item.stream_id}`, {
                    state: { streamData: item },
                  })
                }
              >
                <PanelVideo camera={item} streamId={item.stream_id} />
                <StreamInfo
                  cameraName={item.stream_id}
                  modelName={item.model_name}
                  location={item.location}
                  bg
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border p-4 rounded-md">
        <p className="mb-5 font-semibold text-lg">Upcoming</p>
        {isFetching && <Skeletons />}
        {!isFetching && !data?.upcomingSchedules.length && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            No upcoming schedule.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.upcomingSchedules.map((item, index) => (
            <div className="relative" key={index}>
              <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 flex justify-center items-center cursor-pointer aspect-[16/9]">
                <Icons.offline className="opacity-30" size={50} />
              </div>
              <StreamInfo
                cameraName={item.stream_id}
                modelName={item.model_name}
                location={item.location}
                bg
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Skeletons = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map((_, index) => (
      <Skeleton className="aspect-[16/9] rounded-md" key={index} />
    ))}
  </div>
);
