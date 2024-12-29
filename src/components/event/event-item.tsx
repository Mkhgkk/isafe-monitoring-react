import { Event } from "@/type";
import { getThumbnailUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Skeleton } from "../ui/skeleton";

export function EventItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2 flex-col", className)}>
      <Skeleton className="w-full aspect-[16/9] rounded-sm" />
      <div className="pt-1">
        <Skeleton className="h-5 w-20 rounded-sm mb-2" />
        <Skeleton className="h-3 w-28 rounded-sm mb-1" />
        <Skeleton className="h-3 w-20 rounded-sm" />
      </div>
    </div>
  );
}

function EventItem({
  item,
  className,
  simple = false,
  withoutDate = false,
}: {
  item: Event;
  className?: string;
  simple?: boolean;
  withoutDate?: boolean;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className={cn("gap-2 rounded-md", className)}
      onClick={() => navigate("/events/" + item._id.$oid)}
    >
      <img
        src={getThumbnailUrl(item.thumbnail)}
        className="w-full rounded-sm aspect-[16/9]"
      />
      <div className="mt-1">
        {item.reasons.length > 1 ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <p
                  className={cn("font-semibold mb-1", {
                    "text-sm": simple,
                  })}
                >
                  {t(`eventCause.${item.reasons[0]}`)}{" "}
                  {`(+${item.reasons.length - 1})`}
                </p>
              </TooltipTrigger>
              <TooltipContent className="grid gap-2">
                {item.reasons.map((reason, index) => (
                  <p key={index} className="text-sm">
                    {t(`eventCause.${reason}`)}
                  </p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p
            className={cn("font-semibold mb-1", {
              "text-sm": simple,
            })}
          >
            {t(`eventCause.${item.reasons[0]}`)}
          </p>
        )}

        <p className="text-xs text-zinc-500">
          {item.stream_id} ({item.model_name})
        </p>

        <p className="text-xs text-zinc-500">
          {moment
            .unix(item.timestamp)
            .format(withoutDate ? "HH:mm:ss" : "yyyy-MM-DD HH:mm:ss")}
        </p>
      </div>
    </div>
  );
}

export default EventItem;
