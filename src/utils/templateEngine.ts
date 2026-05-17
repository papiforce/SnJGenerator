import type { ComponentState } from "@/types";

const BLOCK_RE = /\{\{#([a-zA-Z0-9_-]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
const EACH_RE = /\{\{#each:([a-zA-Z0-9_]+)\}\}([\s\S]*?)\{\{\/each:\1\}\}/g;
const SCALAR_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
const BLOCKS_MARKER = "{{BLOCKS}}";

export interface RenderInput {
  template: string;
  data: Record<string, string>;
  defaults: Record<string, string>;
  /** État (ordre + activation) des blocs, issu de la sauvegarde. */
  components: ComponentState[];
}

function renderEachBlocks(
  source: string,
  data: Record<string, string>,
  defaults: Record<string, string>,
): string {
  EACH_RE.lastIndex = 0;
  return source.replace(EACH_RE, (_full, key: string, inner: string) => {
    const raw = data[key] ?? defaults[key] ?? "[]";
    let items: Array<Record<string, string>>;
    try {
      const parsed = JSON.parse(raw);
      items = Array.isArray(parsed) ? parsed : [];
    } catch {
      items = [];
    }
    return items
      .map((item) =>
        inner.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, prop: string) =>
          item[prop] ?? "",
        ),
      )
      .join("");
  });
}

function replaceScalars(
  source: string,
  data: Record<string, string>,
  defaults: Record<string, string>,
): string {
  return source.replace(SCALAR_RE, (_match, key: string) => {
    const value = data[key];
    if (value !== undefined && value !== "") return value;
    return defaults[key] ?? "";
  });
}

/**
 * Rend un template :
 * - Les blocs `{{#id}}…{{/id}}` ne sont rendus que si le composant `id` est actif.
 * - Si le template contient `{{BLOCKS}}`, tous les blocs actifs y sont injectés
 *   dans l'ordre choisi par l'utilisateur (colonne Composants).
 * - Sinon les blocs restent à leur position d'origine (toggle seulement).
 * - Les `{{CLE}}` scalaires sont remplacés par `data`, sinon `defaults`, sinon "".
 */
export function renderTemplate({
  template,
  data,
  defaults,
  components,
}: RenderInput): string {
  const activeById = new Map(components.map((c) => [c.id, c]));
  const blocks = new Map<string, string>();

  BLOCK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BLOCK_RE.exec(template)) !== null) {
    blocks.set(match[1], match[2]);
  }

  let output: string;

  if (template.includes(BLOCKS_MARKER)) {
    const ordered = [...components]
      .filter((c) => c.active && blocks.has(c.id))
      .sort((a, b) => a.order - b.order)
      .map((c) => blocks.get(c.id) ?? "")
      .join("");
    // Retire les définitions inline puis injecte la zone ordonnée.
    output = template
      .replace(BLOCK_RE, "")
      .split(BLOCKS_MARKER)
      .join(ordered);
  } else {
    output = template.replace(BLOCK_RE, (_full, id: string, inner: string) => {
      const state = activeById.get(id);
      return state && state.active ? inner : "";
    });
  }

  output = renderEachBlocks(output, data, defaults);
  return replaceScalars(output, data, defaults);
}

/** Liste les clés scalaires `{{CLE}}` présentes dans un template. */
export function extractScalarKeys(template: string): string[] {
  EACH_RE.lastIndex = 0;
  const withoutBlocks = template.replace(BLOCK_RE, "").replace(EACH_RE, "");
  const keys = new Set<string>();
  SCALAR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = SCALAR_RE.exec(withoutBlocks)) !== null) {
    if (m[1] !== "BLOCKS") keys.add(m[1]);
  }
  return [...keys];
}
