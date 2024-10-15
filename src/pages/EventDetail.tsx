import React, { useEffect, useState } from "react";
import video1 from "@/assets/1.mp4";
import { Separator } from "@/components/ui/separator";
import image from "@/assets/1.jpg";
import { useNavigate } from "react-router-dom";
import EventCard, { EventCardSkeleton } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

function EventDetail() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="pb-4">
      <div className=" mb-4">
        <div className="flex items-center gap-2">
          <Icons.arrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-semibold">Camera name</h1>
        </div>
        {/* <h1 className="text-xl font-semibold">Camera name</h1> */}
        <p className="text-sm text-muted-foreground">
          Accured at 2024.08.08 13:44:30
        </p>
      </div>
      {loading ? (
        <Skeleton className="rounded-md w-full lg:max-w-5xl mb-5 aspect-[16/9]" />
      ) : (
        <div className="overflow-hidden rounded-md w-full lg:max-w-5xl mb-5">
          <video
            // src={video1}
            src={
              "http://localhost:5000/static/videos/video_PPE_20241014211017.mp4"
            }
            controls={true}
            autoPlay
            muted
            loop
            className="w-full"
          />
        </div>
      )}
      <Separator />
      <div className="mt-4">
        <h1 className="text-xl font-semibold mb-4">Related events</h1>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((item) =>
            loading ? (
              <EventCardSkeleton
                className="flex gap-2 w-[250px] border p-2 rounded-md "
                key={item}
              />
            ) : (
              <EventCard
                className="flex gap-2 w-[250px] border p-2 rounded-md "
                key={item}
                item={item}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
