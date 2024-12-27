import empty from "@/assets/empty.png";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

function Empty({ text, className }: { text?: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <div
      className={cn("flex flex-grow flex-col justify-center gap-3", className)}
    >
      <img src={empty} alt="No data" className="w-14 h-14 mx-auto" />
      <p className="text-sm dark:text-muted-foreground mb-4 text-center">
        {text ?? t("common.noResult")}
      </p>
    </div>
  );
}

export default Empty;
