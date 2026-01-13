import { io } from "socket.io-client";

const socket = io("import.meta.env.VITE_API_URL", {
  autoConnect: false, // 🔥 IMPORTANT
});

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth = { token };
  socket.connect();
};

export default socket;
