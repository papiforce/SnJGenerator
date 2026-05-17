import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2, FolderOpen, Pencil, Trash2 } from "lucide-react";
import type { FicheConfig, SaveNamespace } from "@/types";
import { listFiches } from "@/templates/registry";
import {
  createSave,
  deleteSave,
  listAllSaves,
  renameSave,
} from "@/utils/saveStore";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { NavBar } from "./NavBar";

interface FicheHomeProps {
  namespace: SaveNamespace;
  title: string;
  subtitle: string;
  /** Construit l'URL de l'éditeur. */
  editorPath: (ficheSlug: string, saveSlug?: string) => string;
}

export function FicheHome({
  namespace,
  title,
  subtitle,
  editorPath,
}: FicheHomeProps) {
  const navigate = useNavigate();
  const category =
    namespace === "administration" ? "administration" : "joueur";
  const fiches = useMemo(() => listFiches(category), [category]);

  const [version, setVersion] = useState(0);
  const stores = useMemo(() => listAllSaves(namespace), [namespace, version]);

  const [createFor, setCreateFor] = useState<FicheConfig | null>(null);
  const [newName, setNewName] = useState("");
  const [renameTarget, setRenameTarget] = useState<{
    ficheSlug: string;
    slug: string;
    name: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    ficheSlug: string;
    slug: string;
    name: string;
  } | null>(null);
  const [formError, setFormError] = useState("");

  const refresh = () => setVersion((v) => v + 1);

  function openCreate(fiche: FicheConfig) {
    setCreateFor(fiche);
    setNewName("");
    setFormError("");
  }

  function confirmCreate() {
    if (!createFor) return;
    if (newName.trim().length < 2) {
      setFormError("Le nom doit comporter au moins 2 caractères.");
      return;
    }
    const entry = createSave(namespace, createFor, newName);
    setCreateFor(null);
    navigate(editorPath(createFor.slug, entry.slug));
  }

  function confirmRename() {
    if (!renameTarget) return;
    if (renameValue.trim().length < 2) {
      setFormError("Le nom doit comporter au moins 2 caractères.");
      return;
    }
    renameSave(
      namespace,
      renameTarget.ficheSlug,
      renameTarget.slug,
      renameValue,
    );
    setRenameTarget(null);
    refresh();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteSave(namespace, deleteTarget.ficheSlug, deleteTarget.slug);
    setDeleteTarget(null);
    refresh();
  }

  return (
    <>
      <NavBar />
      <div className="app-page">
      <div className="app-container">
        <div className="app-page-head">
          <div>
            <p className="sg-eyebrow">{subtitle}</p>
            <h1 className="sg-h2" style={{ marginTop: 8 }}>
              {title}
            </h1>
          </div>
        </div>

        <div className="app-fiche-grid">
          {fiches.map((f) => (
            <button
              key={f.slug}
              type="button"
              className="sg-card app-fiche-card"
              onClick={() => openCreate(f)}
            >
              <span className="sg-tag sg-tag--gold">{f.category}</span>
              <span className="app-save-card__name">{f.name}</span>
              <span className="sg-body-sm">{f.description}</span>
              <span
                className="app-row"
                style={{ color: "var(--sg-gold)", marginTop: "auto" }}
              >
                <FilePlus2 size={14} /> Nouvelle sauvegarde
              </span>
            </button>
          ))}
          {fiches.length === 0 && (
            <p className="app-empty">Aucun modèle de fiche disponible.</p>
          )}
        </div>

        <div className="app-saves">
          <h2 className="sg-h3" style={{ marginBottom: 20 }}>
            Mes sauvegardes
          </h2>
          {fiches.map((f) => {
            const saves = [...(stores[f.slug] ?? [])].sort((a, b) =>
              b.updatedAt.localeCompare(a.updatedAt),
            );
            if (saves.length === 0) return null;
            return (
              <div key={f.slug} style={{ marginBottom: 28 }}>
                <p className="sg-eyebrow" style={{ marginBottom: 12 }}>
                  {f.name}
                </p>
                <div className="app-save-list">
                  {saves.map((s) => (
                    <div key={s.id} className="sg-card app-save-card">
                      <div className="app-save-card__meta">
                        <div className="app-save-card__name">{s.name}</div>
                        <div className="app-save-card__sub">
                          maj{" "}
                          {new Date(s.updatedAt).toLocaleString("fr-FR")}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="sg-btn sg-btn--secondary sg-btn--sm"
                        onClick={() =>
                          navigate(editorPath(f.slug, s.slug))
                        }
                      >
                        <FolderOpen size={14} /> Ouvrir
                      </button>
                      <button
                        type="button"
                        className="sg-btn sg-btn--ghost sg-btn--sm"
                        onClick={() => {
                          setRenameTarget({
                            ficheSlug: f.slug,
                            slug: s.slug,
                            name: s.name,
                          });
                          setRenameValue(s.name);
                          setFormError("");
                        }}
                        aria-label={`Renommer ${s.name}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="sg-btn sg-btn--ghost sg-btn--sm"
                        onClick={() =>
                          setDeleteTarget({
                            ficheSlug: f.slug,
                            slug: s.slug,
                            name: s.name,
                          })
                        }
                        aria-label={`Supprimer ${s.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {fiches.every((f) => (stores[f.slug] ?? []).length === 0) && (
            <p className="app-empty">
              Aucune sauvegarde. Créez-en une depuis un modèle ci-dessus.
            </p>
          )}
        </div>
      </div>

      <Modal
        open={createFor !== null}
        onClose={() => setCreateFor(null)}
        title="Nouvelle sauvegarde"
        description={
          createFor
            ? `Donnez un nom à votre fiche « ${createFor.name} ».`
            : ""
        }
      >
        <div className="app-field">
          <label className="sg-label" htmlFor="new-save-name">
            Nom
          </label>
          <input
            id="new-save-name"
            className="sg-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmCreate()}
            placeholder="Uchiha Bachira"
          />
          {formError && <p className="app-error">{formError}</p>}
        </div>
        <div className="app-modal__actions">
          <button
            type="button"
            className="sg-btn sg-btn--ghost sg-btn--sm"
            onClick={() => setCreateFor(null)}
          >
            Annuler
          </button>
          <button
            type="button"
            className="sg-btn sg-btn--primary sg-btn--sm"
            onClick={confirmCreate}
          >
            Créer et ouvrir
          </button>
        </div>
      </Modal>

      <Modal
        open={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Renommer la sauvegarde"
      >
        <div className="app-field">
          <label className="sg-label" htmlFor="rename-save">
            Nouveau nom
          </label>
          <input
            id="rename-save"
            className="sg-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmRename()}
          />
          {formError && <p className="app-error">{formError}</p>}
        </div>
        <div className="app-modal__actions">
          <button
            type="button"
            className="sg-btn sg-btn--ghost sg-btn--sm"
            onClick={() => setRenameTarget(null)}
          >
            Annuler
          </button>
          <button
            type="button"
            className="sg-btn sg-btn--primary sg-btn--sm"
            onClick={confirmRename}
          >
            Renommer
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Supprimer la sauvegarde"
        message={
          deleteTarget
            ? `Supprimer définitivement « ${deleteTarget.name} » ? Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      </div>
    </>
  );
}
