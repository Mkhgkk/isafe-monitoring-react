import { Path, UseFormRegister } from "react-hook-form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";

const DateField = <TFormData extends Record<string, any>>({
  id,
  label,
  register,
  error,
  required,
  setValue,
  className,
}: {
  id: Path<TFormData>;
  label: string;
  register: UseFormRegister<TFormData>;
  error?: string;
  required?: boolean;
  className?: string;
  setValue?: () => void;
}) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-1", className)}>
      <Label className="text-xs">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id as string}
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            initialFocus
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setValue(id, selectedDate);
              // register(id).onChange({ target: { value: selectedDate } });
              setOpen(false);
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default DateField;
