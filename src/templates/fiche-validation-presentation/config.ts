import type { FicheConfig } from "@/types";

export const config: FicheConfig = {
  slug: "fiche-validation-presentation",
  name: "Fiche de Validation d'une présentation",
  category: "administration",
  showComponents: false,
  components: [],
  editorFields: [
    { key: "TITRE", label: "Titre", type: "text" },
    { key: "CONTENU", label: "Contenu du message", type: "textarea" },
  ],
  defaultValues: {
    TITRE: "Félicitations !",
    CONTENU:
      'Salut Noisy !\n\nTout est bon pour nous, ta fiche de présentation est validée !\n\nVoici le lien de ta <a href="https://sengoku-no-jidai.forumactif.com/t206-fiche-technique-d-hideyoshi-manme">fiche technique</a>, tu peux dès à présent nous faire part de tes choix.\n\nAmuse-toi bien au sein de Sengoku no Jidai !',
  },
};
