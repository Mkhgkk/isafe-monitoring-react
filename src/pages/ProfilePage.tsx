import { Icons } from "@/components/icons";
import PasswordDialog from "@/components/setting/password-dialog";
import SettingItem from "@/components/setting/setting-item";
import UsernameDialog from "@/components/setting/username-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";

function ProfilePage() {
  return (
    <div className="grid gap-5">
      <div className="mx-auto md:w-[500px] container grid gap-10">
        <h1 className="text-xl font-semibold">Profile</h1>

        <div className="border rounded-md">
          <SettingItem label="Email">
            <p className="text-sm py-2 text-muted-foreground">
              dgm229@hdmdkf.com
            </p>
          </SettingItem>
          <Separator />
          <SettingItem label="Username">
            <UsernameDialog
              trigger={
                <div className="flex items-center cursor-pointer">
                  <p className="text-sm py-2 text-muted-foreground">dgm229</p>
                  <Icons.right className="text-muted-foreground w-4 h-4 ml-1" />
                </div>
              }
            />
          </SettingItem>
          <Separator />

          <SettingItem label="Password">
            <PasswordDialog />
          </SettingItem>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
