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
import { useTranslation } from "react-i18next";

const passwordFormSchema = z
  .object({
    password: z.string(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

export default function PasswordDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
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

  const onSubmit = (values: PasswordFormData) => {
    // if (isActivated) {
    //   stopStream(streamId);
    // } else startStream(streamId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer py-2 pl-4">
          <Icons.right className="text-muted-foreground w-4 h-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("profile.passwordUpdate")}</DialogTitle>
          <DialogDescription className="mt-4">
            {t("profile.passwordUpdateDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={control}
              id="password"
              error={errors.password?.message as string}
              placeholder={t("profile.currentPassword")}
              type="password"
            />
            <FormField
              control={control}
              id="newPassword"
              error={errors.newPassword?.message as string}
              placeholder={t("profile.newPassword")}
              type="password"
            />
            <FormField
              control={control}
              id="comfirmPassword"
              error={errors.confirmPassword?.message as string}
              placeholder={t("profile.confirmPassword")}
              type="password"
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            // loading={isPending || isStopping}
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
