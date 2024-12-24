import React from "react";
import config from "../config/default.config";

interface WebRTCStreamProps {
  streamId: string;
}

const WebRTCStream: React.FC = ({ streamId }: WebRTCStreamProps) => {
  return (
    <iframe
      src={`${config.PROTOCOL}//${config.WEBRTC_STREAM_URL}/${streamId}/`}
      title="WebRTC Stream"
      style={{ width: "100%", height: "100%", border: "none" }}
      allow="autoplay"
    />
  );
};

export default WebRTCStream;
