import React, { useEffect, useState } from "react";
import video1 from "@/assets/1.mp4";
import { Info } from "./MainPage";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WeekCalendar from "@/components/week-calendar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import PTZControl from "@/components/ptz-control";
import PanelVideo from "@/components/panel-video";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cameras } from "./MainPage";
import EventCard, { EventCardSkeleton } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppwrite } from "@/context/AppwriteContext";
import { Query } from "appwrite";

function CameraDetail() {
  const { streamId } = useParams();
  const camera = cameras.find((item) => item.stream_id == streamId);
  const navigate = useNavigate();
  const location = useLocation();
  const { streamData } = location.state;

  const [filter, setFilter] = useState("all");
  const [ptz, setPtz] = useState(camera?.supports_ptz);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const { databases, appwriteClient } = useAppwrite();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        "isafe-guard-db",
        "670d337f001f9ab7ff34",
        [Query.orderDesc("timestamp"), Query.equal("stream_id", streamId)]
      );
      console.log("List of events: ", response.documents);
      setEvents(response.documents);
    } catch (err: any) {
      console.log("CameraDetail - Failed to get list of events: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const unsubscribe = appwriteClient.subscribe(
      "databases.isafe-guard-db.collections.670d337f001f9ab7ff34.documents",
      (response) => {
        if (response.payload.stream_id !== streamId) return;
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // handle new schedule created
          setEvents((prevState) => [response.payload, ...prevState]);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // handle delete schedule
          setEvents((prevState) => [
            ...prevState.filter((item) => item.$id !== response.payload.$id),
          ]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className=" grid grid-cols-12 gap-4">
      <div className="col-span-12  pr-4 lg:col-span-9 lg:border-r">
        <div className="flex items-center gap-2">
          <Icons.arrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-semibold">Monitoring</h1>
        </div>
        <div className="flex items-center mb-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
          <p className="text-sm text-muted-foreground">
            {streamData?.location}
          </p>
        </div>

        {loading ? (
          <Skeleton className="w-full rounded-md aspect-[16/9]" />
        ) : (
          <div className="relative rounded-md aspect-w-16 aspect-h-9 overflow-hidden">
            <PanelVideo streamId={streamId} />

            <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between">
              <div className="py-1 px-3 bg-zinc-200 dark:bg-slate-700 bg-opacity-60 rounded-2xl flex items-center m-5 self-end space-x-1.5">
                <div className="relative flex items-center justify-center h-3 w-3">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600" />
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-600 opacity-75" />
                </div>
                <p className="text-xs font-semibold">Live</p>
              </div>

              {ptz && <PTZControl streamId={streamId} />}

              <div className="flex justify-between items-end">
                <Info
                  modelName={streamData.model_name}
                  cameraName={streamData.stream_id}
                  location={streamData.location}
                  bg
                  className="static p-5"
                />

                <Button
                  className={cn(
                    "bg-opacity-60 bg-zinc-200 dark:bg-slate-700 text-black rounded-full hover:text-white m-5",
                    ptz && "bg-primary text-white"
                  )}
                  size="sm"
                  onClick={() => setPtz(!ptz)}
                >
                  <Icons.control className="w-4 h-4 mr-2" />
                  PTZ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-3">
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
        <ScrollArea className="h-[81vh]">
          <div className="grid gap-y-3">
            {loading
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <EventCardSkeleton key={item} />
                ))
              : events.map((item) => <EventCard item={item} key={item} />)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default CameraDetail;
