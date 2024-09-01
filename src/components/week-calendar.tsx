import React, { useState } from "react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

const today = moment();
const start = today.clone().subtract(6, "days");
const end = today.clone();

function WeekCalendar() {
  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));

  const days = [];
  let day = start.clone();

  while (day.isBefore(end) || day.isSame(end)) {
    days.push(day.clone().format("YYYY-MM-DD"));
    day.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 pb-4">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-center p-1 rounded-md cursor-pointer",
            `${selectedDate === day && "bg-black"}`
          )}
          onClick={() => setSelectedDate(day)}
        >
          <p className="text-xs text-zinc-400">{moment(day).format("ddd")}</p>
          <p
            className={cn("text-sm", `${selectedDate === day && "text-white"}`)}
          >
            {moment(day).format("DD")}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeekCalendar;
