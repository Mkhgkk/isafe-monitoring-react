import { Path, UseFormRegister } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const FormField = <TFormData extends Record<string, any>>({
  id,
  label,
  register,
  error,
  type = "text",
  required,
  className,
}: {
  id: Path<TFormData>;
  label: string;
  register: UseFormRegister<TFormData>; // Correctly typed register with generic form data
  error?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) => (
  <div className={cn("grid gap-1", className)}>
    <Label className="text-xs">
      {label}
      {required && <span className="text-destructive"> *</span>}
    </Label>
    <Input
      id={id as string}
      type={type}
      {...register(id, required ? { required: `${label} is required` } : {})}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export default FormField;
