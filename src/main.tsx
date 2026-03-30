import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Admin from "./Admin";

// Detecta se está na rota /admin
const isAdmin = window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")!).render(
  isAdmin ? <Admin /> : <App />
);
