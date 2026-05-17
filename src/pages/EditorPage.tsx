import { useParams } from "react-router-dom";
import { FicheEditor } from "@/components/FicheEditor";

export function EditorPage() {
  const { ficheSlug = "" } = useParams();
  return (
    <FicheEditor
      namespace="joueur"
      ficheSlug={ficheSlug}
      homePath="/"
      editorPath={(saveSlug) => `/${ficheSlug}?template=${saveSlug}`}
    />
  );
}
