import React from "react";
import SettingItem from "./setting-item";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Icons } from "../icons";
import { Separator } from "../ui/separator";
import { useTheme } from "../theme-provider";
import { useLocale } from "../locale-provider";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function ApperanceSection() {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { setLocale, locale } = useLocale();

  return (
    <div>
      <p className="mb-4 font-semibold">{t("setting.apprerance.title")}</p>
      <div className="border rounded-md">
        <SettingItem label={t("setting.apprerance.theme")}>
          <ToggleGroup type="single" value={theme} onValueChange={setTheme}>
            <ToggleGroupItem value="light">
              <Icons.sun />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark">
              <Icons.moon />
            </ToggleGroupItem>
          </ToggleGroup>
        </SettingItem>
        <Separator />
        <SettingItem label={t("setting.apprerance.language")}>
          <ToggleGroup type="single" value={locale} onValueChange={setLocale}>
            <ToggleGroupItem value="en">En</ToggleGroupItem>
            <ToggleGroupItem value="ko">Kr</ToggleGroupItem>
          </ToggleGroup>
        </SettingItem>
      </div>
    </div>
  );
}

export default ApperanceSection;
