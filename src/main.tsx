import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";

// Restaure le chemin profond conservé par public/404.html (SPA fallback
// GitHub Pages) avant le montage du routeur.
const redirect = sessionStorage.getItem("snj_redirect");
if (redirect) {
  sessionStorage.removeItem("snj_redirect");
  if (redirect !== window.location.pathname + window.location.search) {
    window.history.replaceState(null, "", redirect);
  }
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
