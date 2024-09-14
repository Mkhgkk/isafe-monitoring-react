import React from "react";
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

// Define the form data interface
interface StreamFormData {
  name: string;
  description?: string;
  link: string;
  ip?: string;
  port?: string;
  username?: string;
  password?: string;
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

  const onSubmit: SubmitHandler<StreamFormData> = (data) => {
    console.log(data); // Handle form submission
  };

  const handleOpen = (value: boolean) => {
    if (!value) reset();
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit stream" : "New stream"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              id="name"
              label="Name"
              register={register}
              error={errors.name?.message as string}
              required
            />
            <FormField
              id="description"
              label="Description"
              register={register}
              error={errors.description?.message as string}
            />
            <Separator className="mt-2" />
            <FormField
              id="link"
              label="link"
              register={register}
              error={errors.link?.message as string}
              required
            />
            <div className="grid grid-cols-4 gap-3">
              <FormField
                id="ip"
                label="IP"
                register={register}
                error={errors.ip?.message as string}
                type="text"
                className="col-span-3"
              />
              <FormField
                id="port"
                label="Port"
                register={register}
                error={errors.port?.message as string}
                type="text"
                className="col-span-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="username"
                label="Username"
                register={register}
                error={errors.username?.message as string}
              />
              <FormField
                id="password"
                label="Password"
                register={register}
                error={errors.password?.message as string}
                type="password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add Stream"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StreamForm;
