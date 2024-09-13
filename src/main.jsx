import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ParamsProvider } from "./Context/ParamsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Disable React Developer Tools in production
if (import.meta.env.PROD) {
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    for (const [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value === "function" ? () => {} : null;
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <ParamsProvider>
            <App />
          </ParamsProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
