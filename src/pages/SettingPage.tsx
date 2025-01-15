import { systemService } from "@/api";
import ApperanceSection from "@/components/setting/apperance-section";
import NotificationSection from "@/components/setting/notification-section";
import StorageSection from "@/components/setting/storage-section";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

function SettingPage() {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ["systemService.getSystemSettings"],
    queryFn: () => systemService.getSystemSettings(),
  });

  return (
    <div className="grid gap-5 p-4">
      <div className="sm:mx-auto sm:w-[500px] sm:container grid gap-10">
        <h1 className="text-xl font-semibold">{t("setting.title")}</h1>

        <div className="grid gap-5 lg:gap-10">
          <ApperanceSection />

          <StorageSection eventRetention={data?.video_retention_days} />

          <NotificationSection
            watch={data?.features?.enable_watch_notif}
            email={data?.features?.enable_email_notif}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
