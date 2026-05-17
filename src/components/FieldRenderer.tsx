import { Trash2 } from "lucide-react";
import type { ChronoEvent, EditorFieldDefinition } from "@/types";

function parseChronoEvents(raw: string): ChronoEvent[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface FieldRendererProps {
  field: EditorFieldDefinition;
  value: string;
  onChange: (value: string) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const id = `field-${field.key}`;

  return (
    <div className="app-field">
      <label className="sg-label" htmlFor={id}>
        {field.label}
      </label>

      {field.type === "textarea" && (
        <textarea
          id={id}
          className="sg-textarea"
          rows={5}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "select" && (
        <select
          id={id}
          className="sg-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "toggle" && (
        <label className="app-row" htmlFor={id} style={{ cursor: "pointer" }}>
          <input
            id={id}
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          />
          <span className="sg-body-sm">{field.hint ?? "Activer"}</span>
        </label>
      )}

      {field.type === "color" && (
        <div className="app-row">
          <input
            id={id}
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 44,
              height: 38,
              padding: 2,
              background: "var(--sg-ink-900)",
              border: "1px solid var(--sg-ink-700)",
              borderRadius: "var(--sg-r-sm)",
            }}
          />
          <input
            className="sg-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#c9a558"
            style={{ flex: 1 }}
          />
        </div>
      )}

      {(field.type === "text" || field.type === "image-url") && (
        <input
          id={id}
          className="sg-input"
          type={field.type === "image-url" ? "url" : "text"}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "chrono-list" && (() => {
        const events = parseChronoEvents(value);

        function update(next: ChronoEvent[]) {
          onChange(JSON.stringify(next));
        }

        return (
          <div className="app-chrono-list">
            {events.map((evt, i) => (
              <div key={i} className="app-chrono-item">
                <div className="app-chrono-item__header">
                  <span className="sg-body-sm">Événement {i + 1}</span>
                  <button
                    type="button"
                    className="app-iconbtn"
                    onClick={() => update(events.filter((_, j) => j !== i))}
                    aria-label={`Supprimer l'événement ${i + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  className="sg-input"
                  value={evt.an}
                  placeholder="An XX"
                  onChange={(e) => {
                    update(
                      events.map((ev, j) =>
                        j === i ? { ...ev, an: e.target.value } : ev,
                      ),
                    );
                  }}
                />
                <textarea
                  className="sg-textarea"
                  rows={4}
                  value={evt.texte}
                  placeholder="Description de l'événement..."
                  onChange={(e) => {
                    update(
                      events.map((ev, j) =>
                        j === i ? { ...ev, texte: e.target.value } : ev,
                      ),
                    );
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="sg-btn sg-btn--secondary sg-btn--sm"
              style={{ marginTop: 4 }}
              onClick={() => update([...events, { an: "An XX", texte: "" }])}
            >
              + Ajouter un événement
            </button>
          </div>
        );
      })()}

      {field.hint && field.type !== "toggle" && (
        <p className="sg-body-sm" style={{ marginTop: 6 }}>
          {field.hint}
        </p>
      )}
    </div>
  );
}
