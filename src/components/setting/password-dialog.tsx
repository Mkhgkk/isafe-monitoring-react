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
import { Icons } from "../icons";
import { useState } from "react";
import FormField from "../form/FormField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/api";
import { toast } from "@/hooks/use-toast";

const passwordFormSchema = z
  .object({
    password: z.string().min(6, "validation.password"),
    newPassword: z.string().min(6, "validation.password"),
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "validation.passwordNotMatch",
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
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: userService.updatePassword,
    onSuccess: () => {
      toast({
        description: t("profile.alert.passwordSuccess"),
        variant: "success",
      });

      setOpen(false);
    },
    onError: (error) => {
      if (error?.response?.data?.message === "Incorrect password.") {
        setError("password", {
          type: "manual",
          message: "profile.error.invalidPassword",
        });

        return;
      }
      toast({
        description: t("profile.alert.passwordError"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: PasswordFormData) => {
    updatePassword(values);
  };

  const handleOpen = (value: boolean) => {
    if (value) reset();
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
          <FormField
            control={control}
            id="password"
            error={t(errors.password?.message as string)}
            placeholder={t("profile.currentPassword")}
            type="password"
          />
          <FormField
            control={control}
            id="newPassword"
            error={t(errors.newPassword?.message as string)}
            placeholder={t("profile.newPassword")}
            type="password"
          />
          <FormField
            control={control}
            id="confirmPassword"
            error={t(errors.confirmPassword?.message as string)}
            placeholder={t("profile.confirmPassword")}
            type="password"
          />
          <DialogFooter>
            <Button type="submit" className="mt-2" loading={isPending}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
