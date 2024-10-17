import { Control, Controller, Path } from "react-hook-form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

const SelectField = <TFormData extends Record<string, any>>({
  id,
  label,
  control,
  options,
  error,
  requiredMark,
  className,
}: {
  control: Control<TFormData>;
  id: Path<TFormData>;
  label: string;
  options: { value: string; label: string }[]; // List of options to render
  error?: string;
  requiredMark?: boolean;
  className?: string;
}) => (
  <div className={cn("grid gap-1", className)}>
    <Label className="text-xs">
      {label}
      {requiredMark && <span className="text-destructive"> *</span>}
    </Label>

    <Controller
      name={id}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} {...field}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export default SelectField;
