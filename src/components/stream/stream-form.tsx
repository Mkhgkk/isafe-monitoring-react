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
import { useAppwrite } from "@/context/AppwriteContext";

// Define the form data interface
interface StreamFormData {
  stream_id: string;
  description?: string;
  rtsp_link: string;
  cam_ip?: string;
  ptz_port?: number;
  ptz_password?: string;
  ptz_username?: string;
}

function StreamForm({
  trigger,
  initialData,
}: {
  trigger: React.ReactNode;
  initialData?: StreamFormData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  const [loading, setLoading] = useState(null);
  const [open, setOpen] = useState(false);

  const { databases } = useAppwrite();

  const onSubmit: SubmitHandler<StreamFormData> = async (data) => {
    try {
      setLoading(true);

      if (initialData) {
        // handle update stream
        const response = await databases.updateDocument(
          "isafe-guard-db",
          "66f504260003d64837e5",
          data.$id,
          {
            description: data.description,
            cam_ip: data.cam_ip,
            rtsp_link: data.rtsp_link,
            stream_id: data.stream_id,
            ptz_password: data.ptz_password,
            ptz_port: data.ptz_port ? Number(data.ptz_port) : null,
            ptz_username: data.ptz_username,
          }
        );

        console.log("Document updated successfully:", response);
        reset();
      } else {
        // handle create  new stream
        const response = await databases.createDocument(
          "isafe-guard-db",
          "66f504260003d64837e5",
          "unique()",
          {
            description: data.description,
            cam_ip: data.cam_ip,
            rtsp_link: data.rtsp_link,
            stream_id: data.stream_id,
            ptz_password: data.ptz_password,
            ptz_port: data.ptz_port ? Number(data.ptz_port) : null,
            ptz_username: data.ptz_username,
          }
        );
        console.log("Document created successfully:", response);
        reset();
      }

      setOpen(false);
    } catch (err: any) {
      console.log(err);
    } finally {
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
          <DialogTitle>
            {initialData ? "Edit stream" : "New stream"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              id="stream_id"
              label="Stream ID"
              register={register}
              error={errors.stream_id?.message as string}
              required
            />
            <FormField
              id="description"
              label="Description"
              register={register}
              error={errors.description?.message as string}
            />
            {/* <FormField
              id="location"
              label="Camera Location"
              register={register}
              error={errors.location?.message as string}
            /> */}
            <Separator className="mt-2" />
            <FormField
              id="rtsp_link"
              label="RTSP Link"
              register={register}
              error={errors.rtsp_link?.message as string}
              required
            />
            <div className="grid grid-cols-4 gap-3">
              <FormField
                id="cam_ip"
                label="Cam IP"
                register={register}
                error={errors.cam_ip?.message as string}
                type="text"
                className="col-span-3"
              />
              <FormField
                id="ptz_port"
                label="PTZ Port"
                register={register}
                error={errors.ptz_port?.message as string}
                type="number"
                className="col-span-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="ptz_username"
                label="PTZ username"
                register={register}
                error={errors.ptz_username?.message as string}
              />
              <FormField
                id="ptz_password"
                label="PTZ Password"
                register={register}
                error={errors.ptz_password?.message as string}
                type="text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={loading} type="submit">
              {initialData ? "Save Changes" : "Add Stream"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StreamForm;
