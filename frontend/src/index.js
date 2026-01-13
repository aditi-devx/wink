import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // Make sure this is imported
import "./index.css";

// Create root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App wrapped with AuthProvider and BrowserRouter
root.render(
        <BrowserRouter>

    <AuthProvider>
        <App />
     
    </AuthProvider>
  </BrowserRouter>
);
