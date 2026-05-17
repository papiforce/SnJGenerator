import { useParams } from "react-router-dom";
import { FicheEditor } from "@/components/FicheEditor";

export function AdminEditorPage() {
  const { ficheSlug = "" } = useParams();
  return (
    <FicheEditor
      namespace="administration"
      ficheSlug={ficheSlug}
      homePath="/administration"
      editorPath={(saveSlug) =>
        `/administration/${ficheSlug}?template=${saveSlug}`
      }
    />
  );
}
