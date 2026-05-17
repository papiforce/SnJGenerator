import { FicheHome } from "@/components/FicheHome";

export function HomePage() {
  return (
    <FicheHome
      namespace="joueur"
      title="Générateur de Fiches"
      subtitle="Sengoku no Jidai"
      editorPath={(ficheSlug, saveSlug) =>
        saveSlug
          ? `/${ficheSlug}?template=${saveSlug}`
          : `/${ficheSlug}`
      }
    />
  );
}
