import ApperanceSection from "@/components/setting/apperance-section";
import SettingItem from "@/components/setting/setting-item";
import Storage from "@/components/setting/storage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

function SettingPage() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-5 py-4 md:p-4">
      <div className="mx-auto md:w-[500px] container grid gap-10">
        <h1 className="text-xl font-semibold">{t("setting.title")}</h1>

        <div className="grid gap-5 lg:gap-10">
          <ApperanceSection />

          <div>
            <p className="mb-4 font-semibold">{t("setting.storage.title")}</p>
            <div className="border rounded-md">
              <Storage
                items={[
                  {
                    name: t("setting.storage.video"),
                    color: "bg-indigo-500",
                    size: 15.94,
                  },
                  {
                    name: t("setting.storage.image"),
                    color: "bg-yellow-500",
                    size: 13.32,
                  },
                  {
                    name: t("setting.storage.etc"),
                    color: "bg-slate-500",
                    size: 10.34,
                  },
                ]}
                total={90.35}
              />
              <SettingItem label={t("setting.storage.eventRetention")}>
                <Select value="7">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[1, 7, 14].map((value) => (
                        <SelectItem value={value.toString()} key={value}>
                          {t("common.unit.day", { count: value })}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SettingItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
