import moment from "moment";
import { cn } from "@/lib/utils";

const today = moment();
const start = today.clone().subtract(6, "days");
const end = today.clone();

type Props = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

function WeekCalendar({ selectedDate, setSelectedDate }: Props) {
  const days = [];
  const day = start.clone();

  while (day.isBefore(end) || day.isSame(end)) {
    days.push(day.clone().format("YYYY-MM-DD"));
    day.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 rounded">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-center p-1 rounded-md cursor-pointer",
            `${selectedDate === day && "bg-primary"}`
          )}
          onClick={() => setSelectedDate(day)}
        >
          <p
            className={cn(
              "text-xs text-zinc-400",
              selectedDate === day && "text-white"
            )}
          >
            {moment(day).format("ddd")}
          </p>
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
