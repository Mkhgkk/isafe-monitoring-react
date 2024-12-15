import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  items: { name: string; color: string; size: number }[];
  total: number;
};

function Storage({ items, total }: Props) {
  const { t } = useTranslation();
  return (
    <div className="py-3 px-4 grid gap-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm">{t("setting.storage.serverPc")}</p>
        <p className="text-sm text-muted-foreground">
          {t("setting.storage.usage", {
            used: 43.53,
            total,
          })}
        </p>
      </div>
      <div className="flex gap-0.5 h-10 dark:bg-slate-800 bg-slate-200 rounded overflow-hidden">
        {items.map((item) => (
          <div
            style={{
              width: `${(item.size / total) * 100}%`,
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
                    {item.name} : {item.size} GB
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
                <p>{t("setting.storage.available")} : something GB</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        {items.map((item) => (
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
