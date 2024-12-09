import React from "react";
import SettingItem from "./setting-item";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Icons } from "../icons";
import { Separator } from "../ui/separator";
import { useTheme } from "../theme-provider";

function ApperanceSection() {
  const { setTheme, theme } = useTheme();

  return (
    <div>
      <p className="mb-4 font-semibold">Apperance</p>
      <div className="border rounded-md">
        <SettingItem label="Theme">
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
        <SettingItem label="Language">
          <ToggleGroup type="single">
            <ToggleGroupItem value="a">En</ToggleGroupItem>
            <ToggleGroupItem value="b">Kr</ToggleGroupItem>
          </ToggleGroup>
        </SettingItem>
      </div>
    </div>
  );
}

export default ApperanceSection;
