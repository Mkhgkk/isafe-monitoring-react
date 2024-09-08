import { cn } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router-dom";
import image from "@/assets/1.jpg";
import { Skeleton } from "./ui/skeleton";

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
      onClick={() => navigate("/event/" + item)}
    >
      <img src={image} className="w-[100px] h-[70px] rounded-sm" />
      <div className="flex flex-col jusitfy-center">
        <p className="text-sm font-semibold mb-1 ">Security</p>
        <div>
          <p className="text-xs text-zinc-500">Whatever infor</p>
          <p className="text-xs text-zinc-500">12:01:03 PM</p>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
