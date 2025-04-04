import { authService } from "@/api";
import { Icons } from "@/components/icons";
import PasswordDialog from "@/components/setting/password-dialog";
import SettingItem from "@/components/setting/setting-item";
import UsernameDialog from "@/components/setting/username-dialog";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation();
  const { data: user } = useQuery({
    queryKey: ["authService.getMe"],
    queryFn: authService.getMe,
  });

  return (
    <div className="grid gap-5 p-4">
      <div className="mx-auto md:w-[500px] container grid gap-10">
        <h1 className="text-xl font-semibold">{t("profile.title")}</h1>

        <div className="border rounded-md">
          <SettingItem label={t("profile.email")}>
            <p className="text-sm py-2 text-muted-foreground">{user?.email}</p>
          </SettingItem>
          <Separator />
          <SettingItem label={t("profile.username")}>
            <UsernameDialog
              trigger={
                <div className="flex items-center cursor-pointer">
                  <p className="text-sm py-2 text-muted-foreground">
                    {user?.username}
                  </p>
                  <Icons.right className="text-muted-foreground w-4 h-4 ml-1" />
                </div>
              }
            />
          </SettingItem>
          <Separator />

          <SettingItem label={t("profile.password")}>
            <PasswordDialog />
          </SettingItem>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
