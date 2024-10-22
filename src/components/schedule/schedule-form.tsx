import React, { useState } from "react";
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
import SelectField from "../form/SelectField";
import DateField from "../form/DateField";
import { Separator } from "../ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleService, streamService } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUnixTimestamp } from "@/utils";
import { useToast } from "@/hooks/use-toast";

const timeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/;
const scheduleFormSchema = z
  .object({
    stream_id: z.string(),
    model_name: z.string(),
    location: z.string(),
    startDate: z.date(),
    startTime: z.string().regex(timeRegex, "Invalid time format"),
    endDate: z.date(),
    endTime: z.string().regex(timeRegex, "Invalid time format"),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const startDateTime = new Date(
      `${data.startDate.toISOString().split("T")[0]}T${data.startTime}:00`
    );
    const endDateTime = new Date(
      `${data.endDate.toISOString().split("T")[0]}T${data.endTime}:00`
    );

    if (startDateTime >= endDateTime) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be greater than start date",
        code: "custom",
      });
    }
  });

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

function ScheduleForm({ trigger }: { trigger: React.ReactNode }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: streams } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
  });

  const { mutate: createSchedule, isPending } = useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      console.log("Schedule created successfully");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["scheduleService.fetchSchedules"],
      });
      queryClient.invalidateQueries({
        queryKey: ["scheduleService.fetchAllSchedules"],
      });
      toast({
        description: "New schedule has been created successfully",
        variant: "success",
      });
    },

    onError: (err) => {
      console.log("Error creating schedule: ", err);
      toast({
        description: "Failed to create schedule",
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<ScheduleFormData> = async (data) => {
    const stream = streams?.find((item) => item.stream_id == data.stream_id);

    if (stream)
      createSchedule({
        description: data.description,
        stream_id: data.stream_id,
        start_timestamp: getUnixTimestamp(data.startDate, data.startTime),
        end_timestamp: getUnixTimestamp(data.endDate, data.endTime),
        location: data.location,
        model_name: data.model_name,
        stream_document_id: stream.$id,
      });
  };

  const handleOpen = (value: boolean) => {
    if (!value) reset();
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
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
              control={control}
              id="stream_id"
              label="Stream"
              options={
                streams?.map((item) => ({
                  value: item.stream_id,
                  label: item.stream_id,
                })) ?? []
              }
              error={errors.stream_id?.message as string}
              requiredMark
            />
            <SelectField
              control={control}
              id="model_name"
              label="Model"
              options={[
                { value: "PPE", label: "PPE" },
                { value: "Scaffolding", label: "Scaffolding" },
                { value: "Ladder", label: "Ladder" },
                { value: "MobileScaffolding", label: "Mobile Scaffolding" },
                { value: "CuttingWelding", label: "Cutting Welding" },
              ]}
              error={errors.model_name?.message as string}
              requiredMark
            />
            <FormField
              control={control}
              id="location"
              label="Location"
              error={errors.location?.message as string}
              requiredMark
            />
            <FormField
              control={control}
              id="description"
              label="Description"
              error={errors.description?.message as string}
            />
            <Separator className="mt-1" />
            <div className="grid grid-cols-2 gap-4">
              <DateField
                control={control}
                id="startDate"
                label="Start date"
                error={errors.startDate?.message as string}
                requiredMark
                disabled={{ before: new Date() }}
              />
              <FormField
                control={control}
                id="startTime"
                label="Start time"
                error={errors.startTime?.message as string}
                requiredMark
                mask="99:99"
                placeholder="HH:MM"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateField
                id="endDate"
                label="End date"
                control={control}
                error={errors.endDate?.message as string}
                requiredMark
                disabled={{ before: new Date() }}
              />
              <FormField
                control={control}
                id="endTime"
                label="End time"
                error={errors.endTime?.message as string}
                requiredMark
                mask="99:99"
                placeholder="HH:MM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" loading={isPending}>
              Add Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleForm;
