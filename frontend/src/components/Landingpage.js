import React, { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- import AuthContext

export default function Landingpage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // <-- useContext to get logout

  // Logout handler
  const handleLogout = () => {
    logout();          // clear token and user
    navigate("/login"); // redirect to login page
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "50px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px", fontWeight: "bold" }}>
        Ready to Wink ;) ? 
      </h1>

      <input
        type="text"
        placeholder="Search..."
        style={{
          width: "300px",
          padding: "12px 15px",
          borderRadius: "25px",
          border: "none",
          outline: "none",
          marginBottom: "50px",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "15px 40px",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#ff4081",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e73370")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4081")}
        >
          Video Call
        </button>  

        <button
          onClick={() => navigate("/chat")}
          style={{
            padding: "15px 40px",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#00bfa5",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#009e8f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#00bfa5")}
        >
          Let's Chat
        </button>

        <button
          onClick={handleLogout} // <-- use handler to logout and navigate
          style={{
            padding: "15px 40px",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#ff5252",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e73333")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5252")}
        >
          Logout
        </button>

       
      </div>
    </div>
  );
}
