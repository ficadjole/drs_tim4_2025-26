import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_GATEWAY_URL, {
  path: "/socket.io",
  transports: ["websocket"],
});

