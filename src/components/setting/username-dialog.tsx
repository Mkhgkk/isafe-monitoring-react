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
import { useState } from "react";
import FormField from "../form/FormField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/api";
import { toast } from "@/hooks/use-toast";

const usernameFormSchema = z.object({
  username: z.string().min(3, "validation.username"),
});

type UsernameFormData = z.infer<typeof usernameFormSchema>;

export default function UsernameDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const { mutate: updateUsername, isPending } = useMutation({
    mutationFn: userService.updateUsername,
    onSuccess: () => {
      toast({
        description: t("profile.alert.usernameSuccess"),
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["authService.getMe"],
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        description: t("profile.alert.usernameError"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: UsernameFormData) => {
    updateUsername(values.username);
  };

  const handleOpen = (value: boolean) => {
    if (value) reset();
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("profile.usernameUpdate")}</DialogTitle>
          <DialogDescription className="mt-4">
            {t("profile.usernameUpdateDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
          <FormField
            control={control}
            id="username"
            error={t(errors.username?.message as string)}
            placeholder={t("profile.username")}
          />
          <DialogFooter>
            <Button type="submit" loading={isPending}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
