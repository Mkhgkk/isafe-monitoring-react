import { io } from "socket.io-client";
import config from "../config/default.config";

const SOCKET_SERVER_URL = `${config.SOCKETIO_URL}/default`;

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  upgrade: true,
});

export default socket;
