import React, { useEffect, useState } from "react";
import socket from "../services/socket";

function Inbox({ inboxList, onSelectChat }) {
  const [onlineUsers, setOnlineUsers] = useState({});

  // 🔹 Track online users only
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || {});
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  if (!inboxList || inboxList.length === 0) {
    return <p style={{ padding: "10px" }}>No chats yet.</p>;
  }

  return (
    <div style={{ width: "300px", borderRight: "1px solid #ccc" }}>
      {inboxList.map((chat) => (
        <div
          key={chat.chatUser}
          onClick={() => onSelectChat(chat.chatUser)}
          style={{
            padding: "10px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{chat.chatUser}</strong>
            <br />
            <span style={{ color: "#555" }}>
              {chat.message?.text
                ? chat.message.text.length > 30
                  ? chat.message.text.slice(0, 30) + "..."
                  : chat.message.text
                : "No messages yet"}
            </span>
          </div>

          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: onlineUsers[chat.chatUser]
                ? "green"
                : "gray",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Inbox;
