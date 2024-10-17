import { cn } from "@/lib/utils";

type InfoProps = {
  bg?: boolean;
  className?: string;
  cameraName: string;
  modelName: string;
  location: string;
};

const StreamInfo = ({
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

export default StreamInfo;
