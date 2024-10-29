"use client";

import React, { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange, Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  range?: DateRange;
  setRange: (date?: DateRange) => void;
  disabledDays?: Matcher | Matcher[];
  inputClassName?: string;
};

export function DatePickerWithRange({
  range,
  setRange,
  className,
  disabledDays,
  inputClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & Props) {
  const [date, setDate] = useState<DateRange | undefined>(range);
  const [open, setOpen] = useState(false);

  const handleDateSelect = () => {
    setRange(date);
    setOpen(false);
  };

  const clearRange = () => {
    setRange(undefined);
    setDate(undefined);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal",
              !range && "text-muted-foreground",
              inputClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={disabledDays}
            {...props}
          />
          <div className="p-3 pt-1 justify-between flex">
            <Button size={"sm"} variant="outline" onClick={clearRange}>
              Clear
            </Button>
            <Button size={"sm"} onClick={handleDateSelect}>
              Set range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
