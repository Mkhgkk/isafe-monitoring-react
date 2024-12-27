import { Icons } from "@/components/icons";

import { useNavigate, useParams } from "react-router-dom";
import { streamService } from "@/api";

import { useQuery } from "@tanstack/react-query";
import StreamView from "@/components/camera/stream-view";
import ScheduleEventList from "@/components/camera/schedule-event-list";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PanelVideo from "@/components/panel-video";
import StreamInfo from "@/components/stream/stream-info";
import { Skeletons } from "./MainPage";

import ConfigDropdown from "@/components/camera/config-dropdown";

function OtherCameras({ streamId }: { streamId: string }) {
  const navigate = useNavigate();
  const { data: others = [], isFetching } = useQuery({
    queryKey: ["streamService.fetchStreams"],
    queryFn: streamService.fetchStreams,
    select: (data) => {
      return data.filter(
        (stream) => stream.is_active && stream.stream_id !== streamId
      );
    },
  });
  return (
    <div className="grid-cols-2 gap-4 lg:grid-cols-3 mt-5 hidden lg:grid">
      {isFetching && !others?.length && <Skeletons />}
      {others?.map((item, index) => (
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
  );
}

function CameraDetail() {
  const { t } = useTranslation();
  const { streamId } = useParams();
  const navigate = useNavigate();

  const { data: stream } = useQuery({
    queryKey: ["streamService.fetchStreamById", streamId],
    queryFn: () => streamService.fetchStreamById(streamId!),
    enabled: !!streamId,
  });

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 pr-4 lg:col-span-9 lg:border-r p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Icons.arrowLeft
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                />
                <h1 className="text-xl font-semibold">
                  {t("monitoring.title")}
                </h1>
              </div>
              <div className="flex items-center mb-3">
                <span
                  className={cn("flex h-2 w-2 rounded-full mr-2", {
                    "bg-orange-600": !stream?.is_active,
                    "bg-green-600": stream?.is_active,
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  {stream?.stream_id} - {stream?.model_name} ({stream?.location}
                  )
                </p>
              </div>
            </div>
            {streamId && <ConfigDropdown stream={stream} streamId={streamId} />}
          </div>

          <div className="lg:h-[calc(100vh-104px)] overflow-y-scroll pb-10">
            {streamId && stream?.is_active && (
              <StreamView
                streamId={streamId}
                ptzActivated={
                  !!(
                    stream.ptz_port &&
                    stream.ptz_password &&
                    stream.ptz_username &&
                    stream.cam_ip
                  )
                }
              />
            )}
            {!stream?.is_active && (
              <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 flex justify-center items-center  aspect-[16/9]">
                <Icons.offline className="opacity-30" size={50} />
              </div>
            )}
            {streamId && <OtherCameras streamId={streamId} />}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 p-4 pl-0">
          {streamId && <ScheduleEventList streamId={streamId} />}
        </div>
      </div>
    </>
  );
}

export default CameraDetail;
