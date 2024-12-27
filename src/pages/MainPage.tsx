import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { streamService } from "@/api";
import StreamInfo from "@/components/stream/stream-info";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Empty from "@/components/empty";

export default function MainPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
    select: (data) => {
      return data.filter((stream) => stream.is_active);
    },
  });

  return (
    <div className="grid gap-y-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{t("monitoring.title")}</h1>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-600">{data?.length}</span>{" "}
            {t("monitoring.active")}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <Icons.refresh className="mr-2 w-4 h-4 " />
          {t("common.refresh")}
        </Button>
      </div>

      <div className="flex flex-col overflow-y-scroll h-[calc(100vh-110px)] pb-10 gap-y-4">
        {isFetching && !data?.length && <Skeletons />}
        {!isFetching && !data?.length && (
          <Empty text={t("monitoring.noActiveStream")} />
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((item, index) => (
            <div
              key={index}
              className="relative rounded-md overflow-hidden w-full aspect-[16/9]"
              onClick={() =>
                navigate({
                  pathname: `/cameras/${item.stream_id}`,
                })
              }
            >
              <PanelVideo streamId={item.stream_id} />
              <StreamInfo
                cameraName={item.stream_id}
                modelName={item.model_name}
                location={item.location}
                bg
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Skeletons = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map((_, index) => (
      <Skeleton className="aspect-[16/9] rounded-md" key={index} />
    ))}
  </div>
);
