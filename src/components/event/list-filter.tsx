import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "../icons";
import { DatePickerWithRange } from "../ui/date-picker-range";
import { useQuery } from "@tanstack/react-query";
import { streamService } from "@/api";

export type EventFilters = {
  stream?: string;
  type?: string;
  date?: string;
};

type ListFilterProps = {
  filters: EventFilters;
  setFilters: Dispatch<SetStateAction<EventFilters>>;
};

function ListFilter({ filters, setFilters }: ListFilterProps) {
  const { data: streams } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
    select(data) {
      return data.map((stream) => ({
        label: stream.stream_id,
        value: stream.stream_id,
      }));
    },
  });

  return (
    <>
      <Select
        onValueChange={(value) =>
          setFilters({
            ...filters,
            stream: value === "all" ? undefined : value,
          })
        }
        value={filters.stream}
      >
        <SelectTrigger className="w-[250px] lg:w-[140px]">
          <Icons.cctv className="h-4 w-4 opacity-70" />
          <SelectValue placeholder="Camera" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {streams?.map((stream) => (
              <SelectItem key={stream.value} value={stream.value}>
                {stream.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          setFilters({ ...filters, type: value === "all" ? undefined : value })
        }
        value={filters.type}
      >
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
}

export default ListFilter;
