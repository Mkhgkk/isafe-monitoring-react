import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormField";

import SelectField from "./form/SelectField";
import DateField from "./form/DateField";
import { Separator } from "./ui/separator";

// Define the form data interface
interface ScheduleFormData {
  streamId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  desc?: string;
}

function ScheduleForm({ trigger }: { trigger: React.ReactNode }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<ScheduleFormData> = (data) => {
    console.log(data); // Handle form submission
  };

  const handleOpen = (value: boolean) => {
    if (!value) reset();
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>New Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <SelectField
              id="streamId"
              label="Stream"
              register={register}
              options={[
                { value: "1", label: "Stream 1" },
                { value: "2", label: "Stream 2" },
              ]}
              error={errors.streamId?.message as string}
              required
            />
            <FormField
              id="description"
              label="Description"
              register={register}
              error={errors.description?.message as string}
            />
            <Separator className="mt-1" />
            <div className="grid grid-cols-2 gap-4">
              <DateField
                id="startDate"
                label="Start date"
                register={register}
                error={errors.startDate?.message as string}
                required
              />
              <FormField
                id="startTime"
                label="Start time"
                register={register}
                error={errors.startAt?.message as string}
                required
                mask="datetime"
                inputFormat="HH:mm"
                placeholder="HH:mm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateField
                id="endDate"
                label="End date"
                register={register}
                error={errors.startAt?.message as string}
                required
              />
              <FormField
                id="endTime"
                label="End time"
                register={register}
                error={errors.startAt?.message as string}
                required
                mask="datetime"
                inputFormat="HH:mm"
                placeholder="HH:mm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleForm;
