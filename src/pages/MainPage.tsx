import PanelVideo from "@/components/panel-video";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { streamService } from "@/api";
import StreamInfo from "@/components/stream/stream-info";
import { Skeleton } from "@/components/ui/skeleton";
import { Stream } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function MainPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
    select: (data) => {
      const activeStreams: Stream[] = [];
      const inactiveStreams: Stream[] = [];

      data.forEach((stream) => {
        if (stream.is_active) {
          activeStreams.push(stream);
        } else {
          inactiveStreams.push(stream);
        }
      });

      return { activeStreams, inactiveStreams };
    },
  });

  return (
    <div className="grid gap-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{t("monitoring.title")}</h1>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-600">{data?.activeStreams.length}</span>{" "}
            {t("monitoring.active")} / {data?.inactiveStreams.length}{" "}
            {t("monitoring.inactive")}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <Icons.refresh className="mr-2 w-4 h-4 " />
          {t("common.refresh")}
        </Button>
      </div>

      <div className="overflow-y-scroll max-h-[calc(100vh-100px)] grid gap-y-4">
        <div className="border p-4 rounded-md">
          <p className="mb-5 font-semibold text-lg">
            {t("monitoring.activeStream")}
          </p>
          {isFetching && !data?.activeStreams.length && <Skeletons />}
          {!isFetching && !data?.activeStreams?.length && (
            <p className="text-sm dark:text-muted-foreground mb-4 text-center">
              {t("monitoring.noActiveStream")}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.activeStreams.map((item, index) => (
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
        <div className="border p-4 rounded-md">
          <p className="mb-5 font-semibold text-lg">
            {t("monitoring.inactiveStream")}
          </p>
          {isFetching && !data?.inactiveStreams.length && <Skeletons />}
          {!isFetching && !data?.inactiveStreams.length && (
            <p className="text-sm dark:text-muted-foreground mb-4 text-center">
              {t("monitoring.noInactiveStream")}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.inactiveStreams.map((item, index) => (
              <div
                className="relative cursor-pointer"
                key={index}
                onClick={() =>
                  navigate({
                    pathname: `/cameras/${item.stream_id}`,
                  })
                }
              >
                <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 flex justify-center items-center  aspect-[16/9]">
                  <Icons.offline className="opacity-30" size={50} />
                </div>
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
    </div>
  );
}

const Skeletons = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map((_, index) => (
      <Skeleton className="aspect-[16/9] rounded-md" key={index} />
    ))}
  </div>
);
