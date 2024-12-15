import { io } from "socket.io-client";
import config from "../config/default.config";

const SOCKET_SERVER_URL = `http://${config.BACKEND_URL}/video`;

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  transports: ["websocket"],
  upgrade: true,
});

export default socket;
