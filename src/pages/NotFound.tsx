import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

export function NotFound() {
  return (
    <>
      <NavBar />
      <div className="app-page app-container" style={{ textAlign: "center" }}>
        <p className="sg-kanji" style={{ fontSize: 48, marginBottom: 16 }}>
          迷
        </p>
        <h1 className="sg-h2">Page introuvable</h1>
        <p className="sg-body" style={{ margin: "16px 0 28px" }}>
          Cette route n'existe pas.
        </p>
        <Link to="/" className="sg-btn sg-btn--primary sg-btn--sm">
          Retour à l'accueil
        </Link>
      </div>
    </>
  );
}
