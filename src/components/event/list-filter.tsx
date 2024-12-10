import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "../icons";
import { DatePickerWithRange } from "../ui/date-picker-range";
import { useQuery } from "@tanstack/react-query";
import { streamService } from "@/api";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type EventFilters = {
  stream?: string;
  // type?: string;
  date?: string;
  dateRange?: DateRange;
};

type ListFilterProps = {
  filters: EventFilters;
  setFilters: Dispatch<SetStateAction<EventFilters>>;
};

function ListFilter({ filters, setFilters }: ListFilterProps) {
  const { t } = useTranslation();
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
            stream: value,
          })
        }
        value={filters.stream || ""}
      >
        <SelectTrigger
          className={cn("w-[250px] lg:w-[200px]", {
            "border border-primary": filters.stream,
          })}
        >
          <div className="flex flex-1 items-center gap-3">
            <Icons.cctv className="h-4 w-4 opacity-70" />
            <SelectValue placeholder={t("stream.name")} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem>{t("common.all")}</SelectItem>
          {streams?.map((stream) => (
            <SelectItem key={stream.value} value={stream.value}>
              {stream.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange
        range={filters.dateRange}
        setRange={(dateRange) => setFilters({ ...filters, dateRange })}
        disabledDays={{ after: new Date() }}
        inputClassName={cn({
          "border border-primary":
            filters.dateRange?.from && filters.dateRange?.to,
        })}
      />
    </>
  );
}

export default ListFilter;
