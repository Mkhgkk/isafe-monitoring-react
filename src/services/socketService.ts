import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000/video";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
});

export default socket;
