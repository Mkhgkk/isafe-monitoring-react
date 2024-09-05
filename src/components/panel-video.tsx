import { useEffect, useRef, useState } from "react";
import socket from "../services/socketService";
import { startStream } from "../api/stream";
import useRequest from "@/hooks/useRequest";

import { Icons } from "@/components/icons";

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
    <div onClick={handleClick} className="absolute top-0 left-0 p-2 pt-3">
      <Icons.power className="opacity-70" size={20} />
    </div>
  );
};

export default function PanelVideo({
  camera,
  streamId,
  onClick,
}: PanelVideoProps) {
  const VIDEO_EVENT = `frame-${streamId}`;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [hasStartedStreaming, setHasStartedStreaming] =
    useState<boolean>(false);
  const {
    data,
    loading,
    error,
    request: startStreamRequest,
  } = useRequest(startStream);

  const handleStartStream = async () => {
    await startStreamRequest(camera);

    if (data) {
      setHasStartedStreaming(true);
      setIsStreaming(true);
    }
    console.log("Response: ", data);
    console.log("Error: ", error);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    // Function to resize the canvas to fit the parent container while maintaining aspect ratio
    const resizeCanvas = () => {
      if (canvas) {
        const parentWidth = canvas.parentElement?.clientWidth || 0;
        const aspectRatio = 1280 / 720; // Adjust this if you have a different video frame aspect ratio

        // Set canvas width to parent width and height to maintain the aspect ratio
        canvas.width = parentWidth;
        canvas.height = parentWidth / aspectRatio;
      }
    };

    // Initial resize to set up the canvas size
    resizeCanvas();

    // Add event listener to handle window resizing
    window.addEventListener("resize", resizeCanvas);

    // Join the room using socket and listen for 'frame' events
    socket.emit("join", { room: streamId });

    const handleFrameEvent = (data: any) => {
      console.log("Frame received!");
      setIsStreaming(true);

      if (canvas) {
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Create an Image object
          const image = new Image();
          const blob = new Blob([new Uint8Array(data.image)], {
            type: "image/jpeg",
          });
          const url = URL.createObjectURL(blob);

          image.onload = function () {
            // Resize canvas again in case of any change
            resizeCanvas();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw the image on the canvas
            URL.revokeObjectURL(url); // Revoke the object URL after use
          };

          image.src = url; // Trigger image load and onload event
        }
      }
    };

    socket.on(VIDEO_EVENT, handleFrameEvent);

    // Cleanup function to remove listeners and leave the room
    return () => {
      console.log("Leaving room");
      socket.off(VIDEO_EVENT, handleFrameEvent); // Remove specific event listener
      socket.emit("leave", { room: streamId });
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [streamId]);

  return (
    // <div onClick={onClick}>
    <>
      {!isStreaming && (
        <div className="relative">
          <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-60 flex justify-center items-center cursor-pointer">
            {loading && (
              <Icons.loader className="animate-spin opacity-30" size={50} />
            )}
            {!loading && <Icons.videoOff className="opacity-30" size={50} />}
          </div>
          {/* <Info /> */}
        </div>
      )}
      {isStreaming && (
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block" }} // Use display: block to remove any inline-block space issues
        />
      )}

      <PowerButton onClick={handleStartStream} />
    </>
    // </div>
  );
}
