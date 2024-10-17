import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScheduleForm from "@/components/schedule-form";
import { useEffect } from "react";
import { useState } from "react";
import { useAppwrite } from "@/context/AppwriteContext";
import { scheduleService } from "@/api";
import { Models } from "appwrite";
import StreamInfo from "@/components/stream/stream-info";
import { Skeleton } from "@/components/ui/skeleton";

// rtsp://admin:smart1357!@223.171.32.194:554/profile2/media.smp
// rtsp://admin:smart1357!@223.171.153.134:554/profile2/media.smp
// rtsp://admin:smart456!@223.171.89.221:554/profile2/media.smp

export default function MainPage() {
  const navigate = useNavigate();
  const [ongoingSchedules, setOngoingSchedules] = useState<
    Models.Document<object>[]
  >([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<
    Models.Document<object>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { appwriteClient } = useAppwrite();

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const response = await scheduleService.fetchSchedules();
      const currentTime = Math.floor(Date.now() / 1000);
      const ongoing = response.filter(
        (schedule) => schedule.start_timestamp < currentTime
      );
      const upcoming = response.filter(
        (schedule) => schedule.start_timestamp > currentTime
      );

      setOngoingSchedules(ongoing);
      setUpcomingSchedules(upcoming);

      console.log("List of schedules: ", response);
    } catch (err) {
      console.log("MainPage - Failed to get list of streams: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const unsubscribe = appwriteClient.subscribe(
      "databases.isafe-guard-db.collections.66fa20d600253c7d4503.documents",
      (response) => {
        const { events, payload } = response;
        const currentTime = Math.floor(Date.now() / 1000);

        if (events.includes("databases.*.collections.*.documents.*.create")) {
          if (payload.start_timestamp < currentTime) {
            setOngoingSchedules((prev) => [...prev, payload]);
          } else {
            setUpcomingSchedules((prev) => [...prev, payload]);
          }
        } else if (
          events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          setOngoingSchedules((prev) =>
            prev.filter((item) => item.$id !== payload.$id)
          );
          setUpcomingSchedules((prev) =>
            prev.filter((item) => item.$id !== payload.$id)
          );
        }
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="">
      <div className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">Scheduled</h1>

            <p className="text-sm text-muted-foreground">
              <span className="text-green-600">{ongoingSchedules.length}</span>{" "}
              Ongoing /{" "}
              <span className="text-orange-600">
                {upcomingSchedules.length}
              </span>{" "}
              Upcoming
            </p>
          </div>
          <ScheduleForm
            trigger={
              <Button>
                <Icons.plus className="w-5 h-5 mr-2" />
                New Schedule
              </Button>
            }
          />
        </div>
        <div className="border p-4 rounded-md">
          <p className="mb-5 font-semibold text-lg ">Ongoing</p>
          {loading && <Skeletons />}
          {!loading && !ongoingSchedules.length && (
            <p className="text-sm text-muted-foreground mb-4 text-center">
              No ongoing schedule.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ongoingSchedules.map((item, index) => (
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
        {loading && <Skeletons />}
        {!loading && !upcomingSchedules.length && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            No upcoming schedule.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingSchedules.map((item, index) => (
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
