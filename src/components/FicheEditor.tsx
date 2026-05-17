import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ClipboardCopy, Save } from "lucide-react";
import type { SaveNamespace } from "@/types";
import { getTemplate } from "@/templates/registry";
import { createSave } from "@/utils/saveStore";
import { renderTemplate } from "@/utils/templateEngine";
import { useSave } from "@/hooks/useSave";
import { ComponentList } from "./ComponentList";
import { FieldRenderer } from "./FieldRenderer";
import { PreviewFrame } from "./PreviewFrame";
import { NavBar } from "./NavBar";
import { Modal } from "./Modal";

type Tab = "components" | "preview" | "editor";

interface FicheEditorProps {
  namespace: SaveNamespace;
  ficheSlug: string;
  homePath: string;
  editorPath: (saveSlug: string) => string;
}

export function FicheEditor({
  namespace,
  ficheSlug,
  homePath,
  editorPath,
}: FicheEditorProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const saveSlug = params.get("template");
  const template = getTemplate(ficheSlug);

  const {
    status,
    name,
    data,
    components,
    dirty,
    setField,
    setComponentActive,
    moveComponent,
    persist,
  } = useSave(namespace, ficheSlug, saveSlug);

  const [tab, setTab] = useState<Tab>("editor");
  const [toast, setToast] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState("");

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  const rendered = useMemo(() => {
    if (!template) return "";
    return renderTemplate({
      template: template.html,
      data,
      defaults: template.config.defaultValues,
      components,
    });
  }, [template, data, components]);

  if (!template) {
    return (
      <>
        <NavBar />
        <div className="app-page app-container">
          <h1 className="sg-h3">Modèle introuvable</h1>
          <p className="sg-body" style={{ marginTop: 12 }}>
            Le modèle « {ficheSlug} » n'existe pas.
          </p>
          <Link
            to={homePath}
            className="sg-btn sg-btn--secondary sg-btn--sm"
            style={{ marginTop: 20 }}
          >
            <ArrowLeft size={14} /> Retour
          </Link>
        </div>
      </>
    );
  }

  if (status === "missing") {
    return (
      <>
        <NavBar />
        <Modal
          open
          mandatory
          onClose={() => navigate(homePath)}
          title="Sauvegarde requise"
          description={`Pour éditer une « ${template.config.name} », créez une sauvegarde ou ouvrez-en une existante.`}
        >
          <div className="app-field">
            <label className="sg-label" htmlFor="editor-new-name">
              Nom de la nouvelle sauvegarde
            </label>
            <input
              id="editor-new-name"
              className="sg-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Uchiha Bachira"
            />
            {formError && <p className="app-error">{formError}</p>}
          </div>
          <div className="app-modal__actions">
            <button
              type="button"
              className="sg-btn sg-btn--ghost sg-btn--sm"
              onClick={() => navigate(homePath)}
            >
              <ArrowLeft size={14} /> Retour à l'accueil
            </button>
            <button
              type="button"
              className="sg-btn sg-btn--primary sg-btn--sm"
              onClick={() => {
                if (newName.trim().length < 2) {
                  setFormError("Le nom doit comporter au moins 2 caractères.");
                  return;
                }
                const entry = createSave(
                  namespace,
                  template.config,
                  newName,
                );
                navigate(editorPath(entry.slug));
              }}
            >
              Créer et éditer
            </button>
          </div>
        </Modal>
      </>
    );
  }

  if (status === "loading") {
    return (
      <>
        <NavBar />
        <p className="app-empty">Chargement…</p>
      </>
    );
  }

  const showComponents = template.config.showComponents !== false;

  const visibleFields = template.config.editorFields.filter((f) => {
    if (!f.componentId) return true;
    const c = components.find((x) => x.id === f.componentId);
    return c?.active ?? false;
  });

  async function exportHtml() {
    try {
      await navigator.clipboard.writeText(rendered);
      flash("HTML copié dans le presse-papier");
    } catch {
      flash("Impossible de copier — vérifiez les permissions");
    }
  }

  return (
    <>
      <NavBar />
      <div className="app-tabs">
        {(["components", "preview", "editor"] as Tab[])
          .filter((t) => t !== "components" || showComponents)
          .map((t) => (
            <button
              key={t}
              type="button"
              className={`app-tab${tab === t ? " is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "components"
                ? "Composants"
                : t === "preview"
                  ? "Aperçu"
                  : "Éditeur"}
            </button>
          ))}
      </div>

      <div className={`app-editor${showComponents ? "" : " app-editor--no-components"}`}>
        {showComponents && (
          <div
            className={`app-editor__col${tab === "components" ? " is-active" : ""}`}
          >
            <div className="app-col-title">Composants</div>
            <ComponentList
              definitions={template.config.components}
              state={components}
              onToggle={setComponentActive}
              onMove={moveComponent}
            />
          </div>
        )}

        <div
          className={`app-editor__col app-editor__col--preview${
            tab === "preview" ? " is-active" : ""
          }`}
        >
          <PreviewFrame html={rendered} />
        </div>

        <div
          className={`app-editor__col${tab === "editor" ? " is-active" : ""}`}
        >
          <div className="app-col-title">
            {name}
            {dirty ? " • non sauvegardé" : ""}
          </div>
          <div className="app-row" style={{ marginBottom: 20 }}>
            <Link
              to={homePath}
              className="sg-btn sg-btn--ghost sg-btn--sm"
            >
              <ArrowLeft size={14} /> Retour
            </Link>
            <span className="app-spacer" />
            <button
              type="button"
              className="sg-btn sg-btn--secondary sg-btn--sm"
              onClick={exportHtml}
            >
              <ClipboardCopy size={14} /> Exporter
            </button>
            <button
              type="button"
              className="sg-btn sg-btn--primary sg-btn--sm"
              onClick={() => {
                persist();
                flash("Sauvegardé");
              }}
            >
              <Save size={14} /> Sauvegarder
            </button>
          </div>

          {visibleFields.map((f) => (
            <FieldRenderer
              key={f.key}
              field={f}
              value={data[f.key] ?? template.config.defaultValues[f.key] ?? ""}
              onChange={(v) => setField(f.key, v)}
            />
          ))}
        </div>
      </div>

      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}
