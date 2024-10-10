import React, { useState, useEffect } from "react";
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
import { useAppwrite } from "@/context/AppwriteContext";
import useRequest from "@/hooks/useRequest";
import { createSchedule } from "../api/stream";

// Define the form data interface
interface ScheduleFormData {
  streamId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  desc?: string;
  location: string;
  model_name: string;
}

const getUnixTimestamp = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  date.setHours(hours);
  date.setMinutes(minutes);

  const unixTimestamp = Math.floor(date.getTime() / 1000);

  return unixTimestamp;
};

function ScheduleForm({ trigger }: { trigger: React.ReactNode }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const { databases } = useAppwrite();

  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    data,
    error,
    request: createScheduleRequest,
  } = useRequest(createSchedule);

  const handleCreateSchedule = async (schedule) => {
    try {
      const stream = streams.find(
        (item) => item.stream_id == schedule.stream_id
      );

      const result = await createSchedule({
        stream_document_id: stream.$id,
        ...schedule,
      });

      if (result) {
        console.log("API results: ", result);
      } else {
        console.log("Error: ", error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        "isafe-guard-db",
        "66f504260003d64837e5"
      );
      console.log(
        "Schedule Form - List of streams: ",
        response.documents.map((item) => item.stream_id)
      );
      // setStreams(response.documents.map((item) => item.stream_id));
      setStreams(response.documents);
    } catch (err: any) {
      console.log("Schedule Form - Failed to get list of streams: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const onSubmit: SubmitHandler<ScheduleFormData> = async (data) => {
    try {
      // create schedule
      setLoading(true);
      // const response = await databases.createDocument(
      //   "isafe-guard-db",
      //   "66fa20d600253c7d4503",
      //   "unique()",
      // {
      //   description: data.description,
      //   stream_id: data.stream_id,
      //   start_timestamp: getUnixTimestamp(data.startDate, data.startTime),
      //   end_timestamp: getUnixTimestamp(data.endDate, data.endTime),
      //   location: data.location,
      //   model_name: data.model_name,
      // }
      // );

      // console.log("Document created successfully:", response);
      // TODO:
      // start stream from backend
      await handleCreateSchedule({
        description: data.description,
        stream_id: data.stream_id,
        start_timestamp: getUnixTimestamp(data.startDate, data.startTime),
        end_timestamp: getUnixTimestamp(data.endDate, data.endTime),
        location: data.location,
        model_name: data.model_name,
      });
      // return;
      setOpen(false);
      reset();
    } catch (err) {
      // handle error
      console.log(err);
    } finally {
      // stop loading
      setLoading(false);
    }
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
              id="stream_id"
              label="Stream"
              register={register}
              options={streams.map((item) => ({
                value: item.stream_id,
                label: item.stream_id,
              }))}
              error={errors.stream_id?.message as string}
              setValue={setValue}
              required
            />
            <SelectField
              id="model_name"
              label="Model"
              register={register}
              // options={streams.map((item) => ({ value: item, label: item }))}
              options={[
                { value: "PPE", label: "PPE" },
                { value: "Scaffolding", label: "Scaffolding" },
                { value: "Ladder", label: "Ladder" },
                { value: "MobileScaffolding", label: "Mobile Scaffolding" },
                { value: "CuttingWelding", label: "Cutting Welding" },
              ]}
              error={errors.model_name?.message as string}
              setValue={setValue}
              required
            />
            <FormField
              id="location"
              label="Location"
              register={register}
              error={errors.location?.message as string}
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
                setValue={setValue}
                required
              />
              <FormField
                id="startTime"
                label="Start time"
                register={register}
                error={errors.startTime?.message as string}
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
                error={errors.endDate?.message as string}
                setValue={setValue}
                required
              />
              <FormField
                id="endTime"
                label="End time"
                register={register}
                error={errors.endTime?.message as string}
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
