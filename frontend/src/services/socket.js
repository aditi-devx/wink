import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  autoConnect: false, // only connect when user is logged in
});

// Optional: function to connect with JWT
export const connectSocket = (token, userId) => {
  if (!token) return;

  socket.auth = { token };
  socket.connect();
};

export default socket;
