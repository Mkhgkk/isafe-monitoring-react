// import video1 from "@/assets/1.mp4";
// import video2 from "@/assets/2.mp4";
// import video3 from "@/assets/3.mp4";
import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScheduleForm from "@/components/schedule-form";
import { useEffect } from "react";
import { useState } from "react";
import { useAppwrite } from "@/context/AppwriteContext";
import { Query } from "appwrite";

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

// rtsp://admin:smart1357!@223.171.32.194:554/profile2/media.smp
// rtsp://admin:smart1357!@223.171.153.134:554/profile2/media.smp
// rtsp://admin:smart456!@223.171.89.221:554/profile2/media.smp

interface InfoProps {
  bg?: boolean;
  className: string;
  cameraName: string;
  modelName: string;
  location: string;
}

export const Info = ({
  bg = false,
  className,
  cameraName,
  modelName,
  location,
}: InfoProps) => {
  const textClass = `text-sm  ${bg ? "text-white" : "text-zinc-500"}`;
  return (
    <div
      className={cn(
        `absolute bottom-0 left-0 p-2 pt-5 flex flex-col ${
          bg && "bg-gradient-to-tr from-zinc-900 from-10% via-transparent"
        }`,
        className
      )}
    >
      <p className={textClass}>
        {cameraName}-{modelName}
      </p>
      <p className={textClass}>{location}</p>
    </div>
  );
};

export default function MainPage() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const { databases, appwriteClient } = useAppwrite();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        "isafe-guard-db",
        "66fa20d600253c7d4503",
        [Query.greaterThan("end_timestamp", Math.floor(Date.now() / 1000))]
      );
      console.log("List of schedules: ", response.documents);
      setSchedules(response.documents);
    } catch (err: any) {
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
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // handle new schedule created
          setSchedules((prevState) => [...prevState, response.payload]);
        } else if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // handle delete schedule
          setSchedules((prevState) => [
            ...prevState.filter((item) => item.$id !== response.payload.$id),
          ]);
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
              <span className="text-green-600">2</span> Ongoing /{" "}
              <span className="text-orange-600">6</span> Upcoming
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
        {/* <Separator /> */}
        <div className="border p-4 rounded-md">
          <p className="mb-5 font-semibold text-lg ">Ongoing</p>
          {schedules.length === 0 && (
            <p className="text-sm text-muted-foreground mb-4 text-center">
              No ongoing schedule.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedules
              .filter(
                (schedule) =>
                  schedule.start_timestamp < Math.floor(Date.now() / 1000)
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="relative rounded-md overflow-hidden w-full aspect-[16/9]"
                  onClick={() => navigate(`/cameras/${item.stream_id}`)}
                >
                  <PanelVideo camera={item} streamId={item.stream_id} />
                  <Info
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
      {/* <Separator /> */}
      <div className="border p-4 rounded-md">
        <p className="mb-5 font-semibold text-lg">Upcoming</p>
        {schedules.length === 0 && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            No upcoming schedule.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules
            .filter(
              (schedule) =>
                schedule.start_timestamp > Math.floor(Date.now() / 1000)
            )
            .map((item, index) => (
              <div className="relative" key={index}>
                <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 flex justify-center items-center cursor-pointer aspect-[16/9]">
                  <Icons.offline className="opacity-30" size={50} />
                </div>
                <Info
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
