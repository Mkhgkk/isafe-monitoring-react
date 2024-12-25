const hostname = window.location.hostname;
export default {
  // BACKEND_URL: "192.168.0.33:5000",
  // BACKEND_URL: `${hostname}/api`,
  // WEBRTC_STREAM_URL: `${hostname}`,
  // SOCKETIO_URL: `${hostname}`,
  BACKEND_URL: `192.168.0.33:5000`,
  WEBRTC_STREAM_URL: `192.168.0.33:8889`,
  PROTOCOL: `${window.location.protocol}`,
};
