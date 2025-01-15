import SettingItem from "./setting-item";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

function NotificationSection() {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-4 font-semibold">{t("setting.notification.title")}</p>
      <div className="border rounded-md grid gap-2 py-2">
        <SettingItem label={t("setting.notification.watch")}>
          <Switch />
        </SettingItem>
        <Separator />
        <SettingItem label={t("setting.notification.email")}>
          <Switch />
        </SettingItem>
      </div>
    </div>
  );
}

export default NotificationSection;
