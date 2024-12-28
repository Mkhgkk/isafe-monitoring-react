import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "@/components/icons";
import PanelVideo from "@/components/panel-video";
import PTZControl from "@/components/ptz-control";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { configService } from "@/api";
import { toast } from "@/hooks/use-toast";
import config from "@/config/default.config";
import SafeAreaCanvas from "@/components/safearea-canvas";
import { useTranslation } from "react-i18next";

function HazardSettingPage() {
  const { t } = useTranslation();
  const { streamId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [url, setUrl] = useState<string>();

  const { mutate: getTargetImage, isPending } = useMutation({
    mutationFn: configService.getHazardTargetImage,
    onSuccess: ({ data }) => {
      setUrl(
        `${config.PROTOCOL}//${config.BACKEND_URL}/static/frame_refs/${data}`
      );
    },
    onError: () => {
      toast({
        description: t("common.error.server"),
        variant: "destructive",
      });
    },
  });

  const { mutate: setDangerZone, isPending: isSaving } = useMutation({
    mutationFn: configService.setDangerZone,
    onSuccess: () => {
      toast({
        description: t("hazardArea.alert.success"),
        variant: "success",
      });
      setUrl(undefined);
    },

    onError: () => {
      toast({
        description: t("hazardArea.alert.error"),
        variant: "destructive",
      });
    },
  });

  if (!streamId) {
    return null;
  }

  const handleGetAreaPosition = () => {
    if (canvasRef.current) {
      const coords = canvasRef.current?.getAreaPosition();

      if (!url || !coords) return;

      setDangerZone({
        image: url,
        coords,
        streamId,
      });
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-4">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icons.arrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <h1 className="text-xl font-semibold">{t("hazardArea.title")}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("stream.streamId")}: {streamId}
          </p>
        </div>
        {url && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setUrl(undefined)}>
              {t("hazardArea.recapture")}
            </Button>
            <Button onClick={handleGetAreaPosition} loading={isSaving}>
              {t("hazardArea.save")}
            </Button>
          </div>
        )}
      </div>
      {!url && (
        <div className="mx-auto w-full lg:max-w-5xl my-5 rounded-md overflow-hidden relative aspect-[16/9]">
          <PanelVideo streamId={streamId} />
          <div
            className={cn(
              "absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between py-5"
            )}
          >
            <div />
            <PTZControl streamId={streamId} />
            <div className="flex justify-end items-end px-5">
              <Button onClick={() => getTargetImage(streamId)}>
                {t("hazardArea.capture")}
              </Button>
            </div>
          </div>
          {isPending && (
            <div className="absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-80">
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center">
                  <Icons.loading className="animate-spin mr-2 w-4 h-4" />
                  <p className="text-white">{t("common.loading")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {url && (
        <div className="mx-auto w-full lg:max-w-5xl h-full my-5 rounded-md overflow-hidden">
          <SafeAreaCanvas url={url} ref={canvasRef} />
        </div>
      )}
    </div>
  );
}

export default HazardSettingPage;
