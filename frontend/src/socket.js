import { io } from "socket.io-client";

const socket = io("BACKEND_BASE_URL", {
  //autoConnect: false,
  withCredentials: true,
});

export default socket;
