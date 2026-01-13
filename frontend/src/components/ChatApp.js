import React, { useState, useEffect, useContext, useRef } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import socket, { connectSocket } from "../socketio";

export default function ChatApp() {
  const { token, user } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState("");
  const [activeChatUserName, setActiveChatUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 📹 video states
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // 📞 incoming call
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const incomingOfferRef = useRef(null);

  // 📹 refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    if (!token) return;

    connectSocket(token);

    socket.on("allUsers", (users) => {
      setAllUsers(users.filter((u) => u._id !== user._id));
    });

    socket.on("chatMessage", (msg) => {
      if (
        msg.sender === activeChatUser ||
        msg.receiver === activeChatUser
      ) {
        setMessages((p) => [...p, msg]);
      }
    });

    socket.on("incomingCall", ({ from, offer }) => {
      setIncomingCall(true);
      setCallerId(from);
      incomingOfferRef.current = offer;
    });

    socket.on("callAccepted", async ({ answer }) => {
      await peerConnection?.setRemoteDescription(answer);
    });

    socket.on("iceCandidate", async ({ candidate }) => {
      if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
      }
    });

    return () => socket.removeAllListeners();
  }, [token, activeChatUser, peerConnection, user._id]);

  // ================= STREAM ATTACH =================
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ================= FETCH CHAT =================
  useEffect(() => {
    if (!activeChatUser) return;
    API.get(`/messages/chat/${activeChatUser}`).then((r) =>
      setMessages(r.data)
    );
  }, [activeChatUser]);

  // ================= WEBRTC =================
  const createPeerConnection = (remoteId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", {
          to: remoteId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => setRemoteStream(e.streams[0]);
    return pc;
  };

  const startVideoCall = async () => {
    if (!activeChatUser) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    const pc = createPeerConnection(activeChatUser);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("callUser", { to: activeChatUser, offer });
    setPeerConnection(pc);
  };

  const acceptCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    const pc = createPeerConnection(callerId);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    await pc.setRemoteDescription(incomingOfferRef.current);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answerCall", { to: callerId, answer });

    setPeerConnection(pc);
    setIncomingCall(false);
  };

  const endCall = () => {
    peerConnection?.close();
    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());

    setPeerConnection(null);
    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCall(false);
    setCallerId(null);
  };

  // ================= SEND MESSAGE =================
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text) return;

    const res = await API.post("/messages", {
      receiverId: activeChatUser,
      text,
    });

    setMessages((p) => [...p, res.data]);
    setText("");

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: activeChatUser,
      text: res.data.text,
    });
  };

  // ================= UI =================
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", background: "#000", color: "#fff" }}>
        {allUsers.map((u) => (
          <div
            key={u._id}
            style={{
              padding: 12,
              cursor: "pointer",
              borderBottom: "1px solid #333",
            }}
            onClick={() => {
              setActiveChatUser(u._id);
              setActiveChatUserName(u.username);
            }}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeChatUser && (
          <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
            <strong>{activeChatUserName}</strong>
            <span
              style={{ float: "right", cursor: "pointer" }}
              onClick={startVideoCall}
            >
              📹
            </span>
          </div>
        )}

        {/* Incoming call modal */}
        {incomingCall && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#111",
                padding: 30,
                borderRadius: 12,
                color: "#fff",
                textAlign: "center",
              }}
            >
              <h3>Incoming Video Call</h3>
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={acceptCall}
                  style={{
                    background: "green",
                    color: "#fff",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => setIncomingCall(false)}
                  style={{
                    background: "red",
                    color: "#fff",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Video */}
        {peerConnection && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 9998,
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 200,
                borderRadius: 10,
              }}
            />
            <button
              onClick={endCall}
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "red",
                color: "#fff",
                border: "none",
                padding: "12px 18px",
                borderRadius: "50%",
              }}
            >
              ⛔
            </button>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, padding: 10 }}>
          {messages.map((m) => (
            <div
              key={m._id}
              style={{
                textAlign: m.sender === user._id ? "right" : "left",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 16,
                  background:
                    m.sender === user._id ? "#2575fc" : "#e0e0e0",
                  color: m.sender === user._id ? "#fff" : "#000",
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ display: "flex", padding: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button
            type="submit"
            style={{
              marginLeft: 10,
              background: "#2575fc",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
