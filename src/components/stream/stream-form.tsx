import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import FormField from "../form/FormField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamService } from "@/api";
import { useToast } from "@/hooks/use-toast";
import SelectField from "../form/SelectField";
import { Stream } from "@/type";
import { useTranslation } from "react-i18next";
import { streamModels } from "@/constants";

const streamFormSchema = z.object({
  stream_id: z.string({ message: "validation.required" }),
  description: z.string({ message: "validation.required" }),
  rtsp_link: z.string({ message: "validation.required" }),
  cam_ip: z.string().optional(),
  ptz_port: z.string().optional(),
  ptz_password: z.string().optional(),
  ptz_username: z.string().optional(),
  location: z.string({ message: "validation.required" }),
  model_name: z.string({ message: "validation.required" }),
});

export type StreamFormData = z.infer<typeof streamFormSchema>;

function StreamForm({
  trigger,
  initialData,
}: {
  trigger: React.ReactNode;
  initialData?: StreamFormData;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(streamFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          ptz_port: initialData?.ptz_port?.toString(),
        }
      : undefined,
  });

  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate: createStream, isPending } = useMutation({
    mutationFn: streamService.createStream,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreams"],
      });
      setOpen(false);
      reset();
      toast({
        description: t("stream.alert.newSuccess"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error creating stream: ", err);
      toast({
        description: t("stream.alert.newError"),
        variant: "destructive",
      });
    },
  });

  const { mutate: updateStream, isPending: isUpdating } = useMutation({
    mutationFn: streamService.updateStream,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streamService.fetchStreams"],
      });
      setOpen(false);
      reset();
      toast({
        description: t("stream.alert.updateSuccess"),
        variant: "success",
      });
    },
    onError: (err) => {
      console.log("Error updating stream: ", err);
      toast({
        description: t("stream.alert.updateError"),
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<StreamFormData> = async (data) => {
    if (initialData) {
      updateStream(data as Stream);
    } else createStream(data as Stream);
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
          <DialogTitle>
            {initialData ? t("stream.editStream") : t("stream.newStream")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 px-1 max-h-[80vh] overflow-y-scroll">
            <FormField
              control={control}
              id="stream_id"
              label={t("stream.streamId")}
              error={t(errors.stream_id?.message as string)}
              requiredMark
              disabled={!!initialData}
            />
            <SelectField
              control={control}
              id="model_name"
              label={t("stream.model")}
              options={streamModels}
              error={t(errors.model_name?.message as string)}
              requiredMark
            />
            <FormField
              control={control}
              id="location"
              label={t("stream.location")}
              error={t(errors.location?.message as string)}
              requiredMark
            />
            <FormField
              control={control}
              id="description"
              label={t("stream.desc")}
              error={t(errors.description?.message as string)}
              requiredMark
            />
            <Separator className="mt-2" />
            <FormField
              control={control}
              id="rtsp_link"
              label={t("stream.rtspLink")}
              error={t(errors.rtsp_link?.message as string)}
              requiredMark
            />
            <div className="grid grid-cols-4 gap-3">
              <FormField
                control={control}
                id="cam_ip"
                label={t("stream.camIp")}
                error={errors.cam_ip?.message as string}
                type="text"
                className="col-span-3"
              />
              <FormField
                control={control}
                id="ptz_port"
                label={t("stream.ptzPort")}
                error={errors.ptz_port?.message as string}
                type="number"
                className="col-span-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                id="ptz_username"
                label={t("stream.ptzUsername")}
                error={errors.ptz_username?.message as string}
              />
              <FormField
                control={control}
                id="ptz_password"
                label={t("stream.ptzPassword")}
                error={errors.ptz_password?.message as string}
                type="text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button loading={isPending || isUpdating} type="submit">
              {initialData ? t("common.saveChanges") : t("stream.addStream")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StreamForm;
