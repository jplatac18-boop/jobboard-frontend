// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#020617", // neutral-950
              color: "#e5e7eb",      // neutral-200
              border: "1px solid #1f2937", // neutral-800
              fontSize: "0.8rem",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",  // success-500
                secondary: "#020617",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",  // danger-500
                secondary: "#020617",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
