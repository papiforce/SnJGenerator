import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import type { ComponentDefinition, ComponentState } from "@/types";

interface ComponentListProps {
  definitions: ComponentDefinition[];
  state: ComponentState[];
  onToggle: (id: string, active: boolean) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

export function ComponentList({
  definitions,
  state,
  onToggle,
  onMove,
}: ComponentListProps) {
  const defById = new Map(definitions.map((d) => [d.id, d]));
  const ordered = [...state].sort((a, b) => a.order - b.order);

  if (ordered.length === 0) {
    return (
      <p className="sg-body-sm">Cette fiche n'a pas de blocs optionnels.</p>
    );
  }

  return (
    <div>
      {ordered.map((c, i) => {
        const def = defById.get(c.id);
        if (!def) return null;
        return (
          <div
            key={c.id}
            className={`app-comp${c.active ? "" : " is-inactive"}`}
          >
            <span className="app-comp__label">{def.label}</span>
            <div className="app-comp__btns">
              <button
                type="button"
                className="app-iconbtn"
                disabled={i === 0}
                onClick={() => onMove(c.id, -1)}
                aria-label={`Monter ${def.label}`}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="app-iconbtn"
                disabled={i === ordered.length - 1}
                onClick={() => onMove(c.id, 1)}
                aria-label={`Descendre ${def.label}`}
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="app-iconbtn"
                onClick={() => onToggle(c.id, !c.active)}
                aria-label={
                  c.active ? `Masquer ${def.label}` : `Afficher ${def.label}`
                }
                aria-pressed={c.active}
              >
                {c.active ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
