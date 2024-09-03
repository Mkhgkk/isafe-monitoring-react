import video1 from "@/assets/1.mp4";
import video2 from "@/assets/2.mp4";
import video3 from "@/assets/3.mp4";
import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  return (
    <div className="">
      <div className="pb-4">
        <p className="mb-4 font-semibold text-xl">Online</p>
        <div className="grid grid-cols-3 gap-4">
          {["stream1", "stream2"].map((item, index) => (
            <Link
              to={`/camera/${item}`}
              key={index}
              className="relative rounded-md overflow-hidden"
            >
              {/* <video
                src={item}
                controls={false}
                className="cursor-pointer"
                autoPlay
                muted
                loop
              /> */}
              <PanelVideo streamId={item} />
              <Info bg />
            </Link>
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
