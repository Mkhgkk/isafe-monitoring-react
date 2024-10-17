import { Control, Controller, Path } from "react-hook-form";
import { Label } from "../ui/label";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import MaskedInput from "react-input-mask";

const FormField = <TFormData extends Record<string, any>>({
  id,
  label,
  error,
  className,
  mask,
  requiredMark,
  control,
  ...props
}: InputProps & {
  control: Control<TFormData>;
  id: Path<TFormData>;
  label: string;
  error?: string;
  type?: string;
  className?: string;
  mask?: string;
  requiredMark?: boolean;
}) => {
  return (
    <div className={cn("grid gap-1", className)}>
      <Label className="text-xs">
        {label}
        {requiredMark && <span className="text-destructive"> *</span>}
      </Label>
      <Controller
        control={control}
        name={id}
        render={({ field }) =>
          mask ? (
            <MaskedInput
              mask={mask}
              maskChar=""
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              {(inputProps) => <Input {...field} {...inputProps} {...props} />}
            </MaskedInput>
          ) : (
            <Input {...field} {...props} />
          )
        }
      />

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default FormField;
