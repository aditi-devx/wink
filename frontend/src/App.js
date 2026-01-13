import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/Landingpage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatApp from "./components/ChatApp";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { token, loading } = useContext(AuthContext);
  console.log("TOKEN VALUE:", token);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Default Landing Page */}
      <Route path="/" element={<Login/>} />

      {/* Public Routes */}
      <Route path="/landingpage" element={<LandingPage />} />
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/chat" replace />}
      />
      <Route
        path="/signup"
        element={<Signup />}  
      />

      {/* Protected Route */}
      <Route
        path="/chat"
        element={token ? <ChatApp /> : <Navigate to="/login" replace />}
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
