import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { systemService } from "@/api";
import { bytesToHumanReadable, convertToBytes } from "@/utils";

function Storage() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["systemService.getDisk"],
    queryFn: systemService.getDisk,
    select: (data) => {
      const total = convertToBytes(data.disk_available);
      const used = convertToBytes(data.disk_used);
      const media = convertToBytes(data.disk_media);
      const model = convertToBytes(data.disk_models);
      const base = convertToBytes(data.base);
      const etc = base - media - model;
      const available = total - used;

      return {
        total,
        used,
        available,
        items: [
          {
            name: t("setting.storage.media"),
            color: "bg-indigo-500",
            size: media,
          },
          {
            name: t("setting.storage.model"),
            color: "bg-yellow-500",
            size: model,
          },
          {
            name: t("setting.storage.etc"),
            color: "bg-slate-500",
            size: etc,
          },
        ],
      };
    },
  });

  return (
    <div className="py-3 px-4 grid gap-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm">{t("setting.storage.serverPc")}</p>
        <p className="text-sm text-muted-foreground">
          {t("setting.storage.usage", {
            used: bytesToHumanReadable(data?.used) ?? "-",
            total: bytesToHumanReadable(data?.total) ?? "-",
          })}
        </p>
      </div>
      <div className="flex gap-0.5 h-10 dark:bg-slate-800 bg-slate-200 rounded overflow-hidden">
        {data?.items.map((item) => (
          <div
            style={{
              width: `${(item.size / data.total) * 100}%`,
            }}
            key={item.name}
          >
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">
                  <div className={cn("w-full h-full", item.color)} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {item.name} : {bytesToHumanReadable(item.size)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
        <div className="flex-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="w-full h-full">
                <div className={cn("w-full h-full")} />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("setting.storage.available")} :
                  {bytesToHumanReadable(data?.available)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        {data?.items.map((item) => (
          <div className="flex items-center gap-2" key={item.name}>
            <span className={cn("w-3 h-3 rounded-full", item.color)} />
            <p className="text-sm text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Storage;
