import React, { useEffect, useState } from "react";
import config from "../config/default.config";

interface WebRTCPlayerProps {
  streamId: string;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({ streamId }) => {
  const iframeSrc = `${config.PROTOCOL}//${config.WEBRTC_STREAM_URL}/live/${streamId}/`;

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoErrorMessage, setVideoErrorMessage] = useState<string | null>("");

  const handleMessage = (event) => {
    if (event.data.target !== "mediamtx-webrtc-inpage") return;
    // console.log(event.data);

    if (event.data.type === "error") {
      // show error
      // event.data.message
      // message type:
      //  -- "peer connection closed" - cannot reach peer device either due to server being down or peer disconnected -- show retrying
      //  -- "Error: bad status code 502" - failed to make connection with server
      //  -- "Error: stream not found" - stream is is probably incorrect

      setVideoErrorMessage(event.data.message);
      console.log(event.data);
    } else if (event.data.type === "streaming") {
      // connection established
      // hide error messages related to connection
      // show loading
      setVideoLoading(true);
      setVideoErrorMessage(null);
      console.log(event.data);
    } else if (event.data.type === "event") {
      // canplay || suspended
      // -- canplay hide loading
      // -- suspended show loading
      if (event.data.message === "canplay") setVideoLoading(false);
      console.log(event.data);
    } else {
      // handle default case (probably error too)
      //  -- unknown message
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [iframeSrc]);

  return (
    <div className="w-full h-full">
      <iframe
        src={iframeSrc}
        title="WebRTC Stream"
        // sandbox="allow-scripts allow-same-origin"
        allow="autoplay"
        className="w-full h-full pointer-events-none border-0"
      />
    </div>
  );
};

export default WebRTCPlayer;
