import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "./ui/skeleton";

export const NotificationItemSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={cn("flex gap-3 p-3", className)}>
      <Skeleton className="min-w-[100px] aspect-[4/3] rounded-sm" />
      <div className="pt-1 w-full">
        <Skeleton className="h-5 w-20 rounded-sm mb-1" />
        <Skeleton className="h-3 w-28 rounded-sm mb-2" />
        <Skeleton className="h-3 w-full rounded-sm mb-1" />
        <Skeleton className="h-3 w-full rounded-sm" />
      </div>
    </div>
  );
};

function NotificationItem({ item }) {
  return (
    <div
      className={cn("flex gap-3 border p-3 rounded-md cursor-pointer")}
      //   onClick={() => navigate("/events/" + item)}
    >
      <img src={item.image} className="w-[100px] rounded-sm aspect-[4/3]" />
      <div className="flex flex-col jusitfy-center">
        <p className="text-sm font-semibold ">{item.title}</p>
        <div>
          <p className="text-xs text-zinc-500 mb-2">
            {format(item.timestamp, "yyyy-MM-dd HH:mm")}
          </p>
          <p className="text-xs text-white">
            {item.camera} : {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
