import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { setToken } = useContext(AuthContext); // 👈 only setToken
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // ✅ Save token
      setToken(res.data.token, res.data.user);

      // Optional: socket connection
      const socketModule = (await import("../services/socket")).default;
      socketModule.auth = { token: res.data.token };
      socketModule.connect();

      // Navigate to chat after login
      navigate("/Landingpage"); // <-- updated from "/" to "/chat"
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.msg || "Login failed");
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
        onSubmit={handleLogin}
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2575fc" }}>
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

        <p style={{ textAlign: "center" }}>
          Want to see landing page?{" "}
          <button
            type="button"
            onClick={() => navigate("/landingpage")}
            style={{
              background: "transparent",
              border: "none",
              color: "#2575fc",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Go
          </button>
        </p>
      </form>
    </div>
  );
}
