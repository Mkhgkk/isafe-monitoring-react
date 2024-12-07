import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import socket from "../services/socketService";

import { Icons } from "@/components/icons";
import { useConnectionContext } from "@/context/ConnectionContext";
import WebRTCPlayer from "./webrtc-player";
import { useAlertContext } from "@/context/AlertContext";

interface PanelVideoProps {
  streamId?: string;
  onClick?: () => void;
}

const PanelVideo = forwardRef(({ streamId }: PanelVideoProps, ref) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(!!streamId);
  const { playAlert } = useAlertContext();
  const isFetching = false;

  const { isConnected } = useConnectionContext();

  useEffect(() => {
    if (!isConnected) return;

    socket.emit("join", { room: streamId });
  }, [isConnected, streamId]);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // let resizeTimeout: NodeJS.Timeout;

    // const resizeCanvas = () => {
    //   if (canvas) {
    //     const parentWidth = canvas.parentElement?.clientWidth || 0;
    //     const aspectRatio = 1280 / 720;
    //     canvas.width = parentWidth;
    //     canvas.height = parentWidth / aspectRatio;
    //   }
    // };

    // const debounceResize = () => {
    //   clearTimeout(resizeTimeout);
    //   resizeTimeout = setTimeout(resizeCanvas, 100); // Debounce the resize event
    // };

    // resizeCanvas(); // Initial resize
    // window.addEventListener("resize", debounceResize); // Handle window resizing

    // const handleFrameEvent = (data: any) => {
    //   handleSetIsStreaming();

    //   if (canvas) {
    //     const ctx = canvas.getContext("2d");

    //     if (ctx) {
    //       const image = new Image();
    //       const blob = new Blob([new Uint8Array(data.image)], {
    //         type: "image/webp", // Use WebP for smaller image sizes
    //       });
    //       const url = URL.createObjectURL(blob);

    //       image.onload = () => {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    //         URL.revokeObjectURL(url);
    //       };

    //       image.src = url;
    //     }
    //   }
    // };

    // socket.on(VIDEO_EVENT, handleFrameEvent);

    return () => {
      // socket.off(VIDEO_EVENT, handleFrameEvent);
      // socket.emit("leave", { room: streamId });
      // window.removeEventListener("resize", debounceResize);
    };
  }, [streamId]);

  // useImperativeHandle(ref, () => ({
  //   getCurrentFrame: () => {
  //     const canvas = canvasRef.current;
  //     if (!canvas) return null;
  //     return canvas.toDataURL("image/png");
  //   },
  // }));

  return (
    <>
      {!isStreaming && (
        <div className="absolute w-full h-full">
          <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-full flex justify-center items-center cursor-pointer">
            {isFetching && (
              <Icons.loader className="animate-spin opacity-30" size={50} />
            )}
            {!isFetching && <Icons.videoOff className="opacity-30" size={50} />}
          </div>
        </div>
      )}

      <WebRTCPlayer streamId={streamId!} />
      <div className="absolute h-full left-0 top-0 right-0 bottom-0 flex flex-col justify-between bg-[radial-gradient(circle_at_50%_50%,transparent,#ef4444CC)] animate-pulse" />
    </>
  );
});

export default PanelVideo;
