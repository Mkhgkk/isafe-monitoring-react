import { useEffect, useState } from "react";
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

import EventCard, { EventCardSkeleton } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppwrite } from "@/context/AppwriteContext";
import StreamInfo from "@/components/stream/stream-info";
import { eventService } from "@/api";
import { EventDocument } from "@/type";

export const cameras = [
  {
    id: "camera1",
    cam_ip: "223.171.86.249",
    model_name: "PPE",
    ptz_password: "1q2w3e4r.",
    ptz_port: 80,
    ptz_username: "admin",
    rtsp_link: "rtsp://admin:1q2w3e4r.@218.54.201.82:554/idis?trackid=2",
    stream_id: "1",
    supports_ptz: true,
    ptz_autotrack: false,
    location: "Laboratory",
  },
  {
    id: "camera2",
    cam_ip: "192.168.0.149",
    model_name: "PPE",
    ptz_password: "fsnetworks1!",
    ptz_port: 80,
    ptz_username: "root",
    rtsp_link: "rtsp://root:fsnetworks!@192.168.0.149:554/cam0_0",
    stream_id: "stream2",
    supports_ptz: true,
    ptz_autotrack: false,
    location: "Laboratory",
  },
  {
    id: "camera3",
    cam_ip: "192.168.0.133",
    model_name: "PPE",
    ptz_password: "fsnetworks1!",
    ptz_port: 80,
    ptz_username: "root",
    rtsp_link: "rtsp://root:fsnetworks!@192.168.0.133:554/cam0_0",
    stream_id: "3",
    supports_ptz: true,
    ptz_autotrack: false,
    location: "Laboratory",
  },
  {
    id: "camera4",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link:
      "rtsp://dhh:a12345678@dhh3-4.iptime.org:3554/cam/realmonitor?channel=1&subtype=0",
    stream_id: "4",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera5",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link:
      "rtsp://khh:a12345678@khh5-1.iptime.org:554/cam/realmonitor?channel=1&subtype=0",
    stream_id: "5",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera6",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link:
      "rtsp://dhh:a12345678@dhh00.iptime.org:2554/cam/realmonitor?channel=1&subtype=0",
    stream_id: "6",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera7",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart456!@223.171.153.189:554/profile2/media.smp",
    stream_id: "7",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera8",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart456!@223.171.147.33:554/profile2/media.smp",
    stream_id: "8",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera9",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart1357!@223.171.83.140:554/profile2/media.smp",
    stream_id: "9",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera10",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart1357!@223.171.32.194:554/profile2/media.smp",
    stream_id: "10",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera11",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart1357!@223.171.153.134:554/profile2/media.smp",
    stream_id: "10",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
  {
    id: "camera12",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:smart456!@223.171.89.221:554/profile2/media.smp",
    stream_id: "12",
    supports_ptz: false,
    ptz_autotrack: false,
    location: "Bridge Construction",
  },
];

function CameraDetail() {
  const { streamId } = useParams();
  const camera = cameras.find((item) => item.stream_id == streamId);
  const navigate = useNavigate();
  const location = useLocation();
  const { streamData } = location.state;

  const [filter, setFilter] = useState("all");
  const [ptz, setPtz] = useState(camera?.supports_ptz);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventDocument[]>([]);
  const { appwriteClient } = useAppwrite();

  const fetchEvents = async () => {
    if (!streamId) return;

    try {
      setLoading(true);
      const documents = await eventService.fetchEvents(streamId);
      setEvents(documents as EventDocument[]);
    } catch (err) {
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
        const payload = response.payload as EventDocument;
        if (payload.stream_id !== streamId) return;
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // handle new schedule created
          setEvents((prevState) => [payload, ...prevState]);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // handle delete schedule
          setEvents((prevState) => [
            ...prevState.filter((item) => item.$id !== payload.$id),
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
                <StreamInfo
                  modelName={streamData?.model_name}
                  cameraName={streamData?.stream_id}
                  location={streamData?.location}
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
