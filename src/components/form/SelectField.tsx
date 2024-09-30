import { Path, UseFormRegister } from "react-hook-form";
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
  register,
  options,
  error,
  required,
  className,
  setValue,
}: {
  id: Path<TFormData>;
  label: string;
  register: UseFormRegister<TFormData>;
  options: { value: string; label: string }[]; // List of options to render
  error?: string;
  required?: boolean;
  className?: string;
  setValue?: () => void;
}) => (
  <div className={cn("grid gap-1", className)}>
    <Label className="text-xs">
      {label}
      {required && <span className="text-destructive"> *</span>}
    </Label>
    <Select
      // onValueChange={(value) => register(id).onChange({ target: { value } })} // Handles form value change
      onValueChange={(value) => setValue(id, value)} // Handles form value change
    >
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
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export default SelectField;
