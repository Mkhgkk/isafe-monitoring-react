import { forwardRef, useEffect, useState } from "react";
import socket from "../services/socketService";

import { useConnectionContext } from "@/context/ConnectionContext";
import WebRTCPlayer from "./webrtc-player";
import { useAlertContext } from "@/context/AlertContext";

interface PanelVideoProps {
  streamId?: string;
  onClick?: () => void;
}

const PanelVideo = forwardRef(({ streamId }: PanelVideoProps, ref) => {
  const ALERT_EVENT = `alert-${streamId}`;

  const [intrustion, setIntrustion] = useState(false);
  const { playAlert } = useAlertContext();

  const { isConnected } = useConnectionContext();

  const handleAlert = (value: { type: string }) => {
    if (value.type === "intrusion") {
      setIntrustion(true);
      playAlert();

      setTimeout(() => {
        setIntrustion(false);
      }, 4000);
    }
  };

  useEffect(() => {
    if (!isConnected) return;

    socket.emit("join", { room: streamId });
  }, [isConnected, streamId]);

  useEffect(() => {
    socket.on(ALERT_EVENT, handleAlert);

    return () => {
      socket.off(ALERT_EVENT, handleAlert);
      socket.emit("leave", { room: streamId });
    };
  }, [streamId]);

  return (
    <>
      {/* {!isStreaming && (
        <div className="absolute w-full h-full">
          <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-full flex justify-center items-center cursor-pointer">
            {isFetching && (
              <Icons.loader className="animate-spin opacity-30" size={50} />
            )}
            {!isFetching && <Icons.videoOff className="opacity-30" size={50} />}
          </div>
        </div>
      )} */}

      <WebRTCPlayer streamId={streamId!} />
      {intrustion && (
        <div className="absolute h-full left-0 top-0 right-0 bottom-0 flex flex-col justify-between bg-[radial-gradient(circle_at_50%_50%,transparent,#ef4444CC)] animate-pulse" />
      )}
    </>
  );
});

export default PanelVideo;
