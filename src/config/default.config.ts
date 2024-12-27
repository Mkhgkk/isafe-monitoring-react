const hostname = window.location.hostname;
export default {
  // BACKEND_URL: "192.168.0.33:5000",
  BACKEND_URL: `${hostname}/api`,
  WEBRTC_STREAM_URL: `${hostname}`,
  SOCKETIO_URL: `${hostname}`,
  PROTOCOL: `${window.location.protocol}`,
  // BACKEND_URL: `192.168.0.33/api`,
  // WEBRTC_STREAM_URL: `192.168.0.33`,
  // SOCKET_URL: `192.168.0.33`,
  // PROTOCOL: `http://`,
};
