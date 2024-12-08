import { Icons } from "@/components/icons";
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
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function SettingPage() {
  return (
    <div className="grid gap-5">
      <div className="mx-auto md:w-[500px] container grid gap-10">
        <h1 className="text-xl font-semibold">Settings</h1>

        <div>
          <p className="mb-4 font-semibold">Apperance</p>
          <div className="border rounded-md">
            <SettingItem label="Theme">
              <ToggleGroup type="single">
                <ToggleGroupItem value="a">
                  <Icons.sun />
                </ToggleGroupItem>
                <ToggleGroupItem value="b">
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

        <div>
          <p className="mb-4 font-semibold">Stroage</p>
          <div className="border rounded-md">
            <Storage
              items={[
                { name: "Video", color: "bg-indigo-600", size: 15.94 },
                { name: "Image", color: "bg-yellow-600", size: 13.32 },
                { name: "Etc", color: "bg-slate-600", size: 10.34 },
              ]}
              total={90.35}
            />
            <SettingItem label="Event retention">
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">7 days</SelectItem>
                    <SelectItem value="2">14 days</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SettingItem>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
