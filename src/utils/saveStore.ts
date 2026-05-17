import type {
  ComponentState,
  FicheConfig,
  SaveEntry,
  SaveNamespace,
  SaveStoreShape,
} from "@/types";
import { uniqueSlug } from "./slugify";

const KEYS: Record<SaveNamespace, string> = {
  joueur: "sengoku_saves",
  administration: "sengoku_admin_saves",
};

function readStore(ns: SaveNamespace): SaveStoreShape {
  try {
    const raw = localStorage.getItem(KEYS[ns]);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as SaveStoreShape;
    return {};
  } catch {
    return {};
  }
}

function writeStore(ns: SaveNamespace, store: SaveStoreShape): void {
  localStorage.setItem(KEYS[ns], JSON.stringify(store));
}

export function listSaves(ns: SaveNamespace, ficheSlug: string): SaveEntry[] {
  const list = readStore(ns)[ficheSlug] ?? [];
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listAllSaves(ns: SaveNamespace): SaveStoreShape {
  return readStore(ns);
}

export function getSave(
  ns: SaveNamespace,
  ficheSlug: string,
  slug: string,
): SaveEntry | undefined {
  return readStore(ns)[ficheSlug]?.find((s) => s.slug === slug);
}

function initialComponents(config: FicheConfig): ComponentState[] {
  return config.components.map((c) => ({
    id: c.id,
    active: c.defaultActive,
    order: c.defaultOrder,
  }));
}

export function createSave(
  ns: SaveNamespace,
  config: FicheConfig,
  name: string,
): SaveEntry {
  const store = readStore(ns);
  const list = store[config.slug] ?? [];
  const slug = uniqueSlug(
    name,
    list.map((s) => s.slug),
  );
  const now = new Date().toISOString();
  const entry: SaveEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    slug,
    ficheSlug: config.slug,
    data: { ...config.defaultValues },
    components: initialComponents(config),
    createdAt: now,
    updatedAt: now,
  };
  store[config.slug] = [...list, entry];
  writeStore(ns, store);
  return entry;
}

export function updateSave(
  ns: SaveNamespace,
  ficheSlug: string,
  slug: string,
  patch: Pick<SaveEntry, "data" | "components">,
): SaveEntry | undefined {
  const store = readStore(ns);
  const list = store[ficheSlug] ?? [];
  const idx = list.findIndex((s) => s.slug === slug);
  if (idx === -1) return undefined;
  const updated: SaveEntry = {
    ...list[idx],
    data: patch.data,
    components: patch.components,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  store[ficheSlug] = list;
  writeStore(ns, store);
  return updated;
}

export function renameSave(
  ns: SaveNamespace,
  ficheSlug: string,
  slug: string,
  newName: string,
): SaveEntry | undefined {
  const store = readStore(ns);
  const list = store[ficheSlug] ?? [];
  const idx = list.findIndex((s) => s.slug === slug);
  if (idx === -1) return undefined;
  const otherSlugs = list.filter((_, i) => i !== idx).map((s) => s.slug);
  const updated: SaveEntry = {
    ...list[idx],
    name: newName.trim(),
    slug: uniqueSlug(newName, otherSlugs),
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  store[ficheSlug] = list;
  writeStore(ns, store);
  return updated;
}

export function deleteSave(
  ns: SaveNamespace,
  ficheSlug: string,
  slug: string,
): void {
  const store = readStore(ns);
  const list = store[ficheSlug] ?? [];
  store[ficheSlug] = list.filter((s) => s.slug !== slug);
  writeStore(ns, store);
}
