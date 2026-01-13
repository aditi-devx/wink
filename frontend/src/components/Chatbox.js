import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";

function ChatBox({ chatUser }) {
  const { user: loggedInUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Load chat history + user info
  useEffect(() => {
    if (!chatUser) return;

    const loadChat = async () => {
      try {
        const userRes = await API.get(`/users/${chatUser}`);
        setUser(userRes.data);

        const msgRes = await API.get(`/messages/chat/${chatUser}`);
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Chat load failed:", err);
      }
    };

    loadChat();
  }, [chatUser]);

  // 🔹 Real-time incoming message
  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      if (
        msg.sender === chatUser ||
        msg.receiver === chatUser
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("getMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [chatUser]);

  // 🔹 Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    const messageData = {
      senderId: loggedInUser._id,
      receiverId: chatUser,
      text,
    };

    socket.emit("sendMessage", messageData);

    // Optimistic UI update
    setMessages((prev) => [...prev, messageData]);
    setText("");
  };

  if (!user) return <div style={{ flex: 1 }}>Loading chat...</div>;

  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <h3>Chat with {user.username}</h3>

      <div
        style={{
          height: "70vh",
          border: "1px solid #ccc",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <strong>
              {m.sender === chatUser ? user.username : "You"}:
            </strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
