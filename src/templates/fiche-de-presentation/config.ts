import type { FicheConfig } from "@/types";

const DEFAULT_CHRONO_EVENTS = JSON.stringify([
  {
    an: "An XX",
    texte:
      "Description de ce moment clé dans la vie de votre personnage. Racontez ce qui s'est passé, comment cela l'a marqué, ce que cela a changé en lui.",
  },
]);

export const config: FicheConfig = {
  slug: "fiche-de-presentation",
  name: "Fiche de Présentation",
  description:
    "Présentez votre personnage : identité, traits particuliers, caractère et chronologie.",
  category: "joueur",
  showComponents: false,
  components: [],
  editorFields: [
    {
      key: "COULEUR_PAYS",
      label: "Couleur du pays",
      type: "select",
      hint: "Couleur d'accent du pays (variable --pays).",
      options: [
        { value: "#8b2a20", label: "Hi no Kuni" },
        { value: "#2a3a5e", label: "Mizu no Kuni" },
        { value: "#4a5d3a", label: "Kaze no Kuni" },
        { value: "#c9a558", label: "Kaminari no Kuni" },
        { value: "#996117", label: "Tsuchi no Kuni" },
        { value: "#663399", label: "Autres" },
      ],
    },
    { key: "TITRE_NOM", label: "Nom complet (en-tête)", type: "text" },
    { key: "NOM", label: "Nom", type: "text" },
    { key: "PRENOM", label: "Prénom", type: "text" },
    { key: "AGE", label: "Âge", type: "text" },
    { key: "CLAN", label: "Clan", type: "text" },
    {
      key: "RANG",
      label: "Rang",
      type: "text",
      hint: "C par défaut, B pour les Bras droit, A pour les chefs.",
    },
    { key: "ZONE", label: "Zone de départ", type: "text" },
    { key: "AVATAR", label: "URL de l'avatar", type: "image-url" },
    { key: "TAILLE_POIDS", label: "Taille et poids", type: "text" },
    {
      key: "AUTRES",
      label: "Autres signes particuliers",
      type: "text",
    },
    { key: "CARACTERE", label: "Caractère", type: "textarea" },
    { key: "CHRONO_EVENTS", label: "Chronologie", type: "chrono-list" },
    { key: "IMG_JOUEUR", label: "Image joueur", type: "image-url" },
    { key: "PSEUDO", label: "Pseudo joueur", type: "text" },
    {
      key: "CONNU_FORUM",
      label: "D'où t'as connu le forum ?",
      type: "text",
    },
    {
      key: "SUGGESTIONS",
      label: "Des suggestions ?",
      type: "textarea",
    },
  ],
  defaultValues: {
    COULEUR_PAYS: "#c9a558",
    TITRE_NOM: "Nom prénom",
    NOM: "Nom de Famille",
    PRENOM: "Prénom du personnage",
    AGE: "XX ans",
    CLAN: "Clan du personnage",
    RANG: "Rang (C par défaut, B pour les Bras droit et A pour les chefs)",
    ZONE: "Zone de départ du personnage",
    AVATAR: "https://www.zupimages.net/up/26/18/85jq.jpg",
    TAILLE_POIDS: "xxx cm — xx kg",
    AUTRES: "Signes particuliers.",
    CARACTERE:
      "Décrivez ici la personnalité de votre personnage. Ses vertus, ses vices, ses contradictions, la manière dont il perçoit le monde qui l'entoure, ses peurs, ses ambitions, ce qui le motive à se lever chaque matin malgré le chaos de l'époque.",
    CHRONO_EVENTS: DEFAULT_CHRONO_EVENTS,
    IMG_JOUEUR:
      "https://i.pinimg.com/1200x/62/03/f6/6203f63b6ceef8caed5c6c59130856d9.jpg",
    PSEUDO: "votre pseudo joueur",
    CONNU_FORUM: "réponse ici",
    SUGGESTIONS: "réponse ici",
  },
};
