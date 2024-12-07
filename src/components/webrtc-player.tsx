import React from "react";
import config from "../config/default.config";

interface WebRTCPlayerProps {
  streamId: string;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({ streamId }) => {
  const iframeSrc = `http://${config.WEBRTC_STREAM_URL}/live/${streamId}`;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* The iframe */}
      <iframe
        src={iframeSrc}
        title="WebRTC Stream"
        allow="autoplay"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none", // Prevent mouse interaction directly on the iframe
        }}
      />
    </div>
  );
};

export default WebRTCPlayer;
