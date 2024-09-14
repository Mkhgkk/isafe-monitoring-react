import { Icons } from "@/components/icons";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "@/assets/1.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function EventItemSkeleton() {
  return (
    <div className="">
      <Skeleton className="w-full rounded-sm aspect-[16/9] mb-1 border" />
      <div className="">
        <Skeleton className="h-5 w-20 mb-2 rounded-sm" />
        <Skeleton className="h-3 w-28 rounded-sm mb-0.5" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export default function EventList() {
  const [camera, setCamera] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const Filters = () => (
    <>
      <Select onValueChange={setCamera} value={camera}>
        <SelectTrigger className="w-[250px] lg:w-[140px]">
          <Icons.cctv className="h-4 w-4 opacity-70" />
          <SelectValue placeholder="Camera" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="1">camera 1</SelectItem>
            <SelectItem value="2">camera 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={setType} value={type}>
        <SelectTrigger className="w-[250px] lg:w-[140px]">
          <Icons.alert className="h-4 w-4 opacity-70" />

          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="1">Security</SelectItem>
            <SelectItem value="2">Something</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <DatePickerWithRange />
    </>
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Events</h1>
        <div className="gap-2 hidden lg:flex">
          <Filters />
        </div>
        <Popover>
          <PopoverTrigger className="lg:hidden">
            <Button size="icon" className="w-9 h-9" variant="outline">
              <Icons.filter size={15} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-y-2">
              <Filters />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5 flex-wrap">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) =>
          loading ? (
            <EventItemSkeleton key={item} />
          ) : (
            <div className="gap-2" onClick={() => navigate("/event/" + item)}>
              <img src={image} className="w-full rounded-sm aspect-[16/9]" />
              <div className="">
                <p className="font-semibold mb-1">Security</p>
                <p className="text-xs text-zinc-500">Whatever infor</p>
                <p className="text-xs text-zinc-500">12:01:03 PM</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
