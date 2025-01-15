import ApperanceSection from "@/components/setting/apperance-section";
import NotificationSection from "@/components/setting/notification-section";
import StorageSection from "@/components/setting/storage-section";
import { useTranslation } from "react-i18next";

function SettingPage() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5 p-4">
      <div className="sm:mx-auto sm:w-[500px] sm:container grid gap-10">
        <h1 className="text-xl font-semibold">{t("setting.title")}</h1>

        <div className="grid gap-5 lg:gap-10">
          <ApperanceSection />

          <StorageSection />

          <NotificationSection />
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
