import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "./icons";
import PanelVideo from "./panel-video";
import PTZControl from "./ptz-control";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { configService } from "@/api";
import { toast } from "@/hooks/use-toast";
import config from "@/config/default.config";
import SafeAreaCanvas from "./safearea-canvas";

function HazardAreaSetting() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [url, setUrl] = useState<string>();

  const { mutate: getTargetImage, isPending } = useMutation({
    mutationFn: configService.getHazardTargetImage,
    onSuccess: ({ data }) => {
      setUrl(`http://${config.BACKEND_URL}/static/frame_refs/${data}`);
    },
    onError: (err) => {
      toast({
        description: "Failed to connect to server",
        variant: "destructive",
      });
    },
  });

  const { mutate: setDangerZone, isPending: isSaving } = useMutation({
    mutationFn: configService.setDangerZone,
    onSuccess: () => {
      toast({
        description: "Hazard area has been set successfully",
        variant: "success",
      });
      setUrl(undefined);
    },

    onError: (err) => {
      toast({
        description: "Failed to set hazard area",
        variant: "destructive",
      });
    },
  });

  if (!streamId) {
    return <div>Stream ID not found</div>;
  }

  const handleGetAreaPosition = () => {
    if (canvasRef.current) {
      const areaPosition = canvasRef.current.getAreaPosition();

      if (!url || !areaPosition) return;
      setDangerZone({
        image: url,
        coords: [
          areaPosition.topLeft,
          areaPosition.topRight,
          areaPosition.bottomRight,
          areaPosition.bottomLeft,
        ],
        streamId,
      });
    }
  };

  return (
    <div className="h-[calc(100vh-50px)] flex flex-col">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icons.arrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <h1 className="text-xl font-semibold">Setting Hazard Area</h1>
          </div>
          <p className="text-sm text-muted-foreground">Stream ID: {streamId}</p>
        </div>
        {url && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setUrl(undefined)}>
              Reset
            </Button>
            <Button onClick={handleGetAreaPosition} loading={isSaving}>
              Save Hazard area
            </Button>
          </div>
        )}
      </div>
      {!url && (
        <div className="my-5 rounded-md overflow-hidden max-w-screen-lg relative aspect-[16/9]">
          <PanelVideo streamId={streamId} />
          <div
            className={cn(
              "absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between py-5"
            )}
          >
            <div />
            <PTZControl streamId={streamId} />
            <div className="flex justify-end items-end px-5">
              <Button onClick={() => getTargetImage(streamId)}>Capture</Button>
            </div>
          </div>
          {isPending && (
            <div className="absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-80">
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center">
                  <Icons.loading className="animate-spin mr-2 w-4 h-4" />
                  <p className="text-white">Loading...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {url && (
        <div className="max-w-screen-lg h-full my-5 rounded-md overflow-hidde">
          <SafeAreaCanvas url={url} ref={canvasRef} />
        </div>
      )}
    </div>
  );
}

export default HazardAreaSetting;
