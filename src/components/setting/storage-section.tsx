import { systemService } from "@/api";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Storage from "./storage";
import SettingItem from "./setting-item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Icons } from "../icons";

function StorageSection() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["systemService.getRetention"],
    queryFn: () => systemService.getRetention(),
  });

  const { mutate: updateRetention, isPending } = useMutation({
    mutationFn: systemService.updateRetention,
    onSuccess: () => {
      toast({
        description: t("setting.alert.eventRetentionSuccess"),
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["systemService.getRetention"],
      });
    },
    onError: () => {
      toast({
        description: t("setting.alert.eventRetentionError"),
        variant: "destructive",
      });
    },
  });
  return (
    <div>
      <p className="mb-4 font-semibold">{t("setting.storage.title")}</p>
      <div className="border rounded-md">
        <Storage />
        <SettingItem label={t("setting.eventRetention")}>
          <Select
            value={data?.retention?.toString()}
            disabled={isPending}
            onValueChange={(value) =>
              updateRetention({ retention: Number(value) })
            }
          >
            <SelectTrigger className="w-[100px]">
              <div className="flex gap-2 items-center">
                {isPending ? (
                  <Icons.loading className="animate-spin w-4 h-4" />
                ) : (
                  <SelectValue />
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[7, 14, 30].map((value) => (
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
  );
}

export default StorageSection;
