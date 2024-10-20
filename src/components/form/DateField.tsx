import { Control, Controller, Path } from "react-hook-form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { DayPickerProps } from "react-day-picker";

const DateField = <TFormData extends Record<string, any>>({
  id,
  label,
  control,
  error,
  requiredMark,
  className,
  ...props
}: {
  control: Control<TFormData>;
  id: Path<TFormData>;
  label: string;
  error?: string;
  requiredMark?: boolean;
  className?: string;
} & DayPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("grid gap-1", className)}>
      <Label className="text-xs">
        {label}
        {requiredMark && <span className="text-destructive"> *</span>}
      </Label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id as string}
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                initialFocus
                selected={field.value}
                onSelect={(selectedDate) => {
                  field.onChange(selectedDate);
                  setOpen(false);
                }}
                numberOfMonths={1}
                {...props}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default DateField;
