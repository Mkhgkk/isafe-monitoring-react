// import video1 from "@/assets/1.mp4";
// import video2 from "@/assets/2.mp4";
// import video3 from "@/assets/3.mp4";
import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const cameras = [
  {
    id: "camera1",
    cam_ip: null,
    model_name: "PPE",
    ptz_password: null,
    ptz_port: null,
    ptz_username: null,
    rtsp_link: "rtsp://admin:1q2w3e4r.@218.54.201.82:554/idis?trackid=2",
    stream_id: "stream1",
    supports_ptz: false,
    ptz_autotrack: false,
  },
  {
    id: "camera2",
    cam_ip: "192.168.0.128",
    model_name: "PPE",
    ptz_password: "fsnetworks1!",
    ptz_port: 80,
    ptz_username: "root",
    rtsp_link: "rtsp://root:fsnetworks!@192.168.0.128:554/cam0_0",
    stream_id: "stream2",
    supports_ptz: true,
    ptz_autotrack: false,
  },
  {
    id: "camera3",
    cam_ip: "192.168.0.133",
    model_name: "PPE",
    ptz_password: "fsnetworks1!",
    ptz_port: 80,
    ptz_username: "root",
    rtsp_link: "rtsp://root:fsnetworks!@192.168.0.133:554/cam0_0",
    stream_id: "stream3",
    supports_ptz: true,
    ptz_autotrack: false,
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
    stream_id: "stream4",
    supports_ptz: false,
    ptz_autotrack: false,
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
    stream_id: "stream5",
    supports_ptz: false,
    ptz_autotrack: false,
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
    stream_id: "stream6",
    supports_ptz: false,
    ptz_autotrack: false,
  },
];

export const Info = ({
  bg = false,
  className,
}: {
  bg?: boolean;
  className?: string;
}) => {
  const textClass = `text-sm  ${bg ? "text-white" : "text-zinc-500"}`;
  return (
    <div
      className={cn(
        `absolute bottom-0 left-0 p-2 pt-5 ${
          bg && "bg-gradient-to-tr from-zinc-900 from-10% via-transparent"
        }`,
        className
      )}
    >
      <p className={textClass}>Camera 1</p>
      <p className={textClass}>15-05 2024 12:19:49 PM</p>
    </div>
  );
};

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="pb-4">
        <p className="mb-4 font-semibold text-xl">Online</p>
        <div className="grid grid-cols-3 gap-4">
          {cameras.map((item, index) => (
            <div
              key={index}
              className="relative rounded-md overflow-hidden"
              onClick={() => navigate(`/camera/${item.stream_id}`)}
            >
              <PanelVideo camera={item} streamId={item.stream_id} />
              <Info bg />
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="py-4">
        <p className="mb-4 font-semibold text-xl">Offline</p>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1].map((item, index) => (
            <div className="relative" key={index}>
              <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-60 flex justify-center items-center cursor-pointer">
                <Icons.offline className="opacity-30" size={50} />
              </div>
              <Info />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
