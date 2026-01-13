import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // 🔥 IMPORTANT
});

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth = { token };
  socket.connect();
};

export default socket;
