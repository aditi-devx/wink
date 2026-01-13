import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Signup() {
  const { setToken, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/signup", { username, email, password });
      console.log("Signup request body:", { username, email, password });

      // Automatically login after signup
      setToken(res.data.token);
      setUser(res.data.user);

      // Notify backend via socket
      const socketModule = (await import("../services/socket")).default;
      socketModule.emit("join", res.data.user._id);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2575fc", marginBottom: "20px" }}>
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px",
            transition: "0.3s",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px",
            transition: "0.3s",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px",
            transition: "0.3s",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2575fc",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#6a11cb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2575fc")}
        >
          Signup
        </button>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>
        )}

       <p>
  Already have an account?{" "}
  <Link to="/" style={{ color: "#2575fc", textDecoration: "none" }}>
    Login
  </Link>
</p>

      </form>
    </div>
  );
}
