import React from "react";
import config from "../config/default.config";

interface WebRTCPlayerProps {
  streamId: string;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({ streamId }) => {
  const iframeSrc = `${config.PROTOCOL}//${config.WEBRTC_STREAM_URL}/live/${streamId}/`;

  return (
    <div className="w-full h-full">
      <iframe
        src={iframeSrc}
        title="WebRTC Stream"
        allow="autoplay"
        className="w-full h-full pointer-events-none border-0"
      />
    </div>
  );
};

export default WebRTCPlayer;
