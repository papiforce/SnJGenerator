import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ComponentState,
  SaveEntry,
  SaveNamespace,
} from "@/types";
import { getSave, updateSave } from "@/utils/saveStore";

export type SaveStatus = "loading" | "missing" | "ready";

export function useSave(
  ns: SaveNamespace,
  ficheSlug: string,
  slug: string | null,
) {
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [name, setName] = useState("");
  const [data, setData] = useState<Record<string, string>>({});
  const [components, setComponents] = useState<ComponentState[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!slug) {
      setStatus("missing");
      return;
    }
    const entry = getSave(ns, ficheSlug, slug);
    if (!entry) {
      setStatus("missing");
      return;
    }
    setName(entry.name);
    setData(entry.data);
    setComponents(entry.components);
    setSavedAt(entry.updatedAt);
    setDirty(false);
    setStatus("ready");
  }, [ns, ficheSlug, slug]);

  const setField = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const setComponentActive = useCallback((id: string, active: boolean) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c)),
    );
    setDirty(true);
  }, []);

  const moveComponent = useCallback((id: string, dir: -1 | 1) => {
    setComponents((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= sorted.length) return prev;
      [sorted[idx], sorted[target]] = [sorted[target], sorted[idx]];
      const reordered = sorted.map((c, i) => ({ ...c, order: i }));
      return reordered;
    });
    setDirty(true);
  }, []);

  const persist = useCallback((): SaveEntry | undefined => {
    if (!slug) return undefined;
    const updated = updateSave(ns, ficheSlug, slug, { data, components });
    if (updated) {
      setSavedAt(updated.updatedAt);
      setDirty(false);
    }
    return updated;
  }, [ns, ficheSlug, slug, data, components]);

  const orderedComponents = useMemo(
    () => [...components].sort((a, b) => a.order - b.order),
    [components],
  );

  return {
    status,
    name,
    data,
    components: orderedComponents,
    savedAt,
    dirty,
    setField,
    setComponentActive,
    moveComponent,
    persist,
  };
}
