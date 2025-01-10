import React, { useEffect, useState } from "react";
import config from "../config/default.config";
import { Icons } from "./icons";
import { useTranslation } from "react-i18next";

interface WebRTCPlayerProps {
  streamId: string;
}

const handledErrors = {
  "peer connection closed": "connectionClosed",
  "Error: bad status code 502": "serverNotAvailable",
  "Error: stream not found": "streamNotFound",
} as const;

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({ streamId }) => {
  const { t } = useTranslation();
  const iframeSrc = `${config.PROTOCOL}//${config.WEBRTC_STREAM_URL}/live/${streamId}/`;

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoErrorMessage, setVideoErrorMessage] = useState<string>();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeErrorMessage, setIframeErrorMessage] = useState<string>();

  const handleMessage = (event: MessageEvent) => {
    if (event.data.target !== "mediamtx-webrtc-inpage") return;

    switch (event.data.type) {
      case "error": {
        const msg = event.data.message;

        const errorKey = Object.keys(handledErrors).find((error) =>
          msg.includes(error)
        ) as keyof typeof handledErrors | undefined;

        if (errorKey) {
          const translationKey = handledErrors[errorKey];
          setVideoErrorMessage(t(`stream.error.${translationKey}`));
        } else {
          setVideoErrorMessage(t(`stream.error.server`));
        }

        break;
      }
      case "streaming":
        setVideoLoading(true);
        setVideoErrorMessage(undefined);
        break;
      case "event":
        if (event.data.message === "playing") setVideoLoading(false);
        break;
      default:
        setVideoErrorMessage(t("stream.error.server"));
        break;
    }
  };

  const handleIframeError = () => {
    setIframeLoaded(false);
    setIframeErrorMessage(t("stream.error.streamingServer"));
  };

  const handleIframeLoad = () => {
    setIframeErrorMessage(undefined);
    setIframeLoaded(true);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [iframeSrc]);

  return (
    <div className="w-full h-full">
      {(videoLoading || !iframeLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-zinc-200 dark:bg-zinc-900">
          <Icons.loading className="animate-spin" />
        </div>
      )}
      {(videoErrorMessage || iframeErrorMessage) && (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-zinc-200 dark:bg-zinc-900">
          <p className="text-white">
            {videoErrorMessage || iframeErrorMessage}
          </p>
        </div>
      )}
      <iframe
        src={iframeSrc}
        title="WebRTC Stream"
        // sandbox="allow-scripts allow-same-origin"
        allow="autoplay"
        className="w-full h-full pointer-events-none border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default WebRTCPlayer;
