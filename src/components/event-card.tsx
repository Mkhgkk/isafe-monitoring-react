import { cn } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import config from "../config/default.config";
import moment from "moment";

export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Skeleton className="w-[100px] h-[70px] rounded-sm" />
      <div className="pt-1">
        <Skeleton className="h-5 w-20 rounded-sm mb-2" />
        <Skeleton className="h-3 w-28 rounded-sm mb-1" />
        <Skeleton className="h-3 w-20 rounded-sm" />
      </div>
    </div>
  );
}

type Props = {
  item: any;
  className?: string;
};

function EventCard({ item, className }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className={cn("flex gap-2", className)}
      onClick={() => navigate("/events/" + item)}
    >
      <img
        src={`http://${config.BACKEND_URL}/static/thumbnails/${item.thumbnail}`}
        className="w-[100px] h-[70px] rounded-sm"
      />
      <div className="flex flex-col jusitfy-center">
        <p className="text-sm font-semibold mb-1 ">{item.title}</p>
        <div>
          <p className="text-xs text-zinc-500">{item.description}</p>
          <p className="text-xs text-zinc-500">
            {moment.unix(item.timestamp).format("hh:mm:ss A")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
