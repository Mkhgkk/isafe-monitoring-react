import { forwardRef, useEffect, useState } from "react";
import socket from "../services/socketService";

import { useConnectionContext } from "@/context/ConnectionContext";
import WebRTCPlayer from "./webrtc-player";
import { useAlertContext } from "@/context/AlertContext";
import { useDebouncedCallback } from "use-debounce";

interface PanelVideoProps {
  streamId?: string;
  onClick?: () => void;
}

const PanelVideo = forwardRef(({ streamId }: PanelVideoProps) => {
  const ALERT_EVENT = `alert-${streamId}`;

  const [intrustion, setIntrustion] = useState(false);
  const [showIntrustion, setShowIntrustion] = useState(false);
  const { playAlert } = useAlertContext();

  const { isConnected } = useConnectionContext();

  const debounced = useDebouncedCallback((value) => {
    if (intrustion) return;
    setShowIntrustion(value);
  }, 200);

  const handleAlert = (value: { type: string }) => {
    if (value.type === "intrusion") {
      setIntrustion(true);
      setShowIntrustion(true);
      playAlert();

      setTimeout(() => {
        setIntrustion(false);
        debounced(false);
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
      <WebRTCPlayer streamId={streamId!} />

      {/* bg-[radial-gradient(circle_at_50%_50%,transparent,#ef4444CC)] */}
      {showIntrustion && (
        <div className="absolute h-full left-0 top-0 right-0 bottom-0 flex flex-col justify-between bg-red-500 bg-opacity-50 animate-pulse-intense" />
      )}
    </>
  );
});

export default PanelVideo;
