import React, { useState } from "react";
import video1 from "@/assets/1.mp4";
import { Info } from "./MainPage";

import image from "@/assets/1.jpg";
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
import { useParams } from "react-router-dom";

function CameraDetail() {
  const [filter, setFilter] = useState("all");
  const [ptz, setPtz] = useState(false);

  const { streamId } = useParams();

  return (
    <div className=" grid grid-cols-12 gap-4">
      <div className="col-span-9 border-r pr-4">
        <h1 className="text-xl font-semibold">Monitoring</h1>
        <div className="flex items-center mb-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
          <p className="text-sm text-muted-foreground">Construction site 4</p>
        </div>

        <div className="relative rounded-md w-full overflow-hidden">
          {/* <video
            src={video1}
            controls={false}
            autoPlay
            muted
            loop
            className="w-full"
          /> */}
          <PanelVideo streamId={streamId} />

          <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between">
            <div className="py-1 px-3 bg-zinc-200 dark:bg-slate-700 bg-opacity-60 rounded-2xl flex items-center m-5 self-end">
              <span className="flex h-2 w-2 rounded-full bg-red-600 mr-1.5" />
              <p className="text-xs font-semibold">Live</p>
            </div>
            {ptz && <PTZControl streamId={streamId} />}

            <div className="flex justify-between items-end">
              <Info bg className="static p-5" />

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
      </div>

      <div className="col-span-3 ">
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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div className="flex gap-2">
                <img src={image} className="w-[100px] h-[70px] rounded-sm" />
                <div className="">
                  <p className="text-sm font-semibold mb-1">Security</p>
                  <p className="text-xs text-zinc-500">Whatever infor</p>
                  <p className="text-xs text-zinc-500">12:01:03 PM</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default CameraDetail;
