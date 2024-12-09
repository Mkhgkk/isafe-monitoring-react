import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Icons } from "../icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamService } from "@/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import FormField from "../form/FormField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const usernameFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type UsernameFormData = z.infer<typeof usernameFormSchema>;

export default function UsernameDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  });
  //   const queryClient = useQueryClient();

  //   const { mutate: startStream, isPending } = useMutation({
  //     mutationFn: streamService.startStream,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: ["streamService.fetchStreamById", streamId],
  //       });
  //       queryClient.invalidateQueries({
  //         queryKey: ["streamService.fetchStreams"],
  //       });

  //       setOpen(false);

  //       toast({
  //         description: "Stream has been started successfully",
  //         variant: "success",
  //       });
  //     },
  //     onError: (err) => {
  //       console.error(err);
  //     },
  //   });

  //   const { mutate: stopStream, isPending: isStopping } = useMutation({
  //     mutationFn: streamService.stopStream,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: ["streamService.fetchStreamById", streamId],
  //       });
  //       queryClient.invalidateQueries({
  //         queryKey: ["streamService.fetchStreams"],
  //       });

  //       setOpen(false);

  //       toast({
  //         description: "Stream has been stopped successfully",
  //         variant: "success",
  //       });
  //     },
  //     onError: (err) => {
  //       console.error(err);
  //     },
  //   });

  const onSubmit = (values: UsernameFormData) => {
    // if (isActivated) {
    //   stopStream(streamId);
    // } else startStream(streamId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update username</DialogTitle>
          <DialogDescription className="mt-4">
            Enter new username
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            id="username"
            error={errors.username?.message as string}
            placeholder="John Doe"
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            // loading={isPending || isStopping}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
