import SettingItem from "./setting-item";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { systemService } from "@/api";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../icons";

function NotificationSection({
  watch,
  email,
}: {
  watch?: boolean;
  email?: boolean;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: updateWatch, isPending: isPendingWatch } = useMutation({
    mutationFn: systemService.updateWatchNotif,
    onSuccess: () => {
      toast({
        description: t("setting.alert.watchNotificationSuccess"),
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["systemService.getSystemSettings"],
      });
    },
    onError: () => {
      toast({
        description: t("setting.alert.watchNotificationError"),
        variant: "destructive",
      });
    },
  });

  const { mutate: updateEmail, isPending: isPendingEmail } = useMutation({
    mutationFn: systemService.updateEmailNotif,
    onSuccess: () => {
      toast({
        description: t("setting.alert.emailNotificationSuccess"),
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["systemService.getSystemSettings"],
      });
    },
    onError: () => {
      toast({
        description: t("setting.alert.emailNotificationError"),
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <p className="mb-4 font-semibold">{t("setting.notification.title")}</p>
      <div className="border rounded-md grid gap-2 py-2">
        <SettingItem label={t("setting.notification.watch")}>
          <div className="flex gap-2 items-center">
            {isPendingWatch && (
              <Icons.loading className="animate-spin w-4 h-4" />
            )}
            <Switch
              checked={watch}
              onCheckedChange={(value) => updateWatch({ enable: value })}
              disabled={isPendingWatch}
            />
          </div>
        </SettingItem>
        <Separator />
        <SettingItem label={t("setting.notification.email")}>
          <div className="flex gap-2 items-center">
            {isPendingEmail && (
              <Icons.loading className="animate-spin w-4 h-4" />
            )}
            <Switch
              checked={email}
              onCheckedChange={(value) => updateEmail({ enable: value })}
              disabled={isPendingEmail}
            />
          </div>
        </SettingItem>
      </div>
    </div>
  );
}

export default NotificationSection;
