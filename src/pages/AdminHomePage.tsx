import { FicheHome } from "@/components/FicheHome";

export function AdminHomePage() {
  return (
    <FicheHome
      namespace="administration"
      title="Fiches Administration"
      subtitle="Espace Staff"
      editorPath={(ficheSlug, saveSlug) =>
        saveSlug
          ? `/administration/${ficheSlug}?template=${saveSlug}`
          : `/administration/${ficheSlug}`
      }
    />
  );
}
