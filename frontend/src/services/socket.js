import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: false, // only connect when user is logged in
});

// Optional: function to connect with JWT
export const connectSocket = (token, userId) => {
  if (!token) return;

  socket.auth = { token };
  socket.connect();

  // Notify backend of online user
 
};

export default socket;
