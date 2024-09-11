import { useEffect, useRef, useState } from "react";
import socket from "../services/socketService";
import { startStream } from "../api/stream";
import useRequest from "@/hooks/useRequest";

import { Icons } from "@/components/icons";
import WebRTCStream from "./webrtc-stream";

interface PanelVideoProps {
  streamId: string;
  camera: any;
  onClick?: () => void;
}

const PowerButton = ({ onClick }: any) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent div
    onClick?.(e);
  };

  return (
    <div onClick={handleClick} className="absolute top-0 right-0 p-2 pt-3">
      <Icons.power className="opacity-90 text-blue-500" size={20} />
    </div>
  );
};

export default function PanelVideo({ camera, streamId }: PanelVideoProps) {
  const {
    data,
    loading,
    error,
    request: startStreamRequest,
  } = useRequest(startStream);

  const handleStartStream = async () => {
    await startStreamRequest(camera);
    if (data) {
      // setHasStartedStreaming(true);
      // setIsStreaming(true);
    }
    console.log("Response: ", data);
    console.log("Error: ", error);
  };

  // const handleSetIsStreaming = () => {
  //   if (!isStreaming) setIsStreaming(true);
  // };

  useEffect(() => {
    // Cleanup function to remove listeners and leave the room
    return () => {
      console.log("Leaving room");
      socket.emit("leave", { room: streamId });
    };
  }, [streamId]);

  return (
    // <div onClick={onClick}>
    <>
      {/* {!isStreaming && (
        <div className="absolute w-full h-full">
          <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-full flex justify-center items-center cursor-pointer">
            {loading && (
              <Icons.loader className="animate-spin opacity-30" size={50} />
            )}
            {!loading && <Icons.videoOff className="opacity-30" size={50} />}
          </div>
        </div>
      )} */}
      {/* <canvas
        ref={canvasRef}
        className="w-full h-full max-h-screen max-w-screen block"
        // style={{ width: "100%", height: "auto", display: "block" }} // Use display: block to remove any inline-block space issues
      /> */}
      <div className="w-full h-full max-h-screen max-w-screen block">
        <WebRTCStream streamId={streamId} />
      </div>
      <PowerButton onClick={handleStartStream} />
    </>
    // </div>
  );
}
