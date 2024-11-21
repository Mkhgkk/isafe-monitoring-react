import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import socket from "../services/socketService";
import { startStream } from "../api/stream";
import useRequest from "@/hooks/useRequest";

import { Icons } from "@/components/icons";
import { useConnectionContext } from "@/context/ConnectionContext";
import { useQuery } from "@tanstack/react-query";
import { streamService } from "@/api";

interface PanelVideoProps {
  streamId?: string;
  camera: any;
  onClick?: () => void;
}

const PowerButton = ({ onClick }: any) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div onClick={handleClick} className="absolute top-0 right-0 p-2 pt-3">
      <Icons.power className="opacity-90 text-blue-500" size={20} />
    </div>
  );
};

const PanelVideo = forwardRef(
  ({ camera, streamId, onClick }: PanelVideoProps, ref) => {
    const VIDEO_EVENT = `frame-${streamId}`;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(!!streamId);
    const isFetching = false;
    const [hasStartedStreaming, setHasStartedStreaming] =
      useState<boolean>(false);

    // const { data, isFetching } = useQuery({
    //   queryKey: ["streamService.startStream", camera],
    //   queryFn: () => streamService.startStream(camera),
    // });
    // const {
    //   data,
    //   loading,
    //   error,
    //   request: startStreamRequest,
    // } = useRequest(startStream);

    const { isConnected } = useConnectionContext();

    // const handleStartStream = async () => {
    //   await startStreamRequest(camera);

    //   if (data) {
    //     setHasStartedStreaming(true);
    //     setIsStreaming(true);
    //   }
    // };

    const handleSetIsStreaming = () => {
      if (!isStreaming) setIsStreaming(true);
    };

    useEffect(() => {
      if (!isConnected) return;

      socket.emit("join", { room: streamId });
    }, [isConnected, streamId]);

    useEffect(() => {
      const canvas = canvasRef.current;
      let resizeTimeout: NodeJS.Timeout;

      const resizeCanvas = () => {
        if (canvas) {
          const parentWidth = canvas.parentElement?.clientWidth || 0;
          const aspectRatio = 1280 / 720;
          canvas.width = parentWidth;
          canvas.height = parentWidth / aspectRatio;
        }
      };

      const debounceResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100); // Debounce the resize event
      };

      resizeCanvas(); // Initial resize
      window.addEventListener("resize", debounceResize); // Handle window resizing

      const handleFrameEvent = (data: any) => {
        handleSetIsStreaming();

        if (canvas) {
          const ctx = canvas.getContext("2d");

          if (ctx) {
            const image = new Image();
            const blob = new Blob([new Uint8Array(data.image)], {
              type: "image/webp", // Use WebP for smaller image sizes
            });
            const url = URL.createObjectURL(blob);

            image.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);
            };

            image.src = url;
          }
        }
      };

      socket.on(VIDEO_EVENT, handleFrameEvent);

      return () => {
        socket.off(VIDEO_EVENT, handleFrameEvent);
        socket.emit("leave", { room: streamId });
        window.removeEventListener("resize", debounceResize);
      };
    }, [streamId]);

    useImperativeHandle(ref, () => ({
      getCurrentFrame: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.toDataURL("image/png");
      },
    }));

    return (
      <>
        {!isStreaming && (
          <div className="absolute w-full h-full">
            <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 h-full flex justify-center items-center cursor-pointer">
              {isFetching && (
                <Icons.loader className="animate-spin opacity-30" size={50} />
              )}
              {!isFetching && (
                <Icons.videoOff className="opacity-30" size={50} />
              )}
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full max-h-screen max-w-screen block"
        />
      </>
    );
  }
);

export default PanelVideo;
