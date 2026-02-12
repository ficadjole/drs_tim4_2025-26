import { io } from "socket.io-client";
export const socket = io("https://user-service-latest-gzbk.onrender.com/api/", {
  path: "/socket.io",
  transports: ["websocket"],
});

