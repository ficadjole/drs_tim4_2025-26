import { io } from "socket.io-client";
export const socket = io("https://user-service.onrender.com", {
  transports: ["websocket"],
});

