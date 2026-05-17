import { useState, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { NavBar } from "./NavBar";

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAuthed, authenticate } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (isAuthed) return <>{children}</>;

  async function submit() {
    setPending(true);
    setError("");
    const ok = await authenticate(password);
    setPending(false);
    if (!ok) {
      setError("Mot de passe incorrect.");
      setPassword("");
    }
  }

  return (
    <>
      <NavBar />
      <div className="app-gate">
        <div className="sg-card app-gate__card">
          <div
            className="sg-avatar sg-avatar--lg sg-avatar--gold"
            style={{ margin: "0 auto 20px" }}
          >
            <ShieldCheck size={24} />
          </div>
          <h1 className="app-modal__title">Espace Administration</h1>
          <p className="app-modal__desc">
            Cette section est réservée au staff. Saisissez le mot de passe.
          </p>
          <div className="app-field" style={{ textAlign: "left" }}>
            <label className="sg-label" htmlFor="admin-pw">
              Mot de passe
            </label>
            <input
              id="admin-pw"
              className="sg-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
            {error && <p className="app-error">{error}</p>}
          </div>
          <button
            type="button"
            className="sg-btn sg-btn--primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
            onClick={submit}
            disabled={pending || password.length === 0}
          >
            {pending ? "Vérification…" : "Entrer"}
          </button>
        </div>
      </div>
    </>
  );
}
