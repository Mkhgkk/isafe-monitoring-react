import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.0.10:5000/video";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
});

export default socket;
