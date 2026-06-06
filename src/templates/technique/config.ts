import type { FicheConfig } from "@/types";

export const config: FicheConfig = {
  slug: "creation-de-technique",
  name: "Création de technique",
  description: "Décrivez une technique ninja avec ses caractéristiques.",
  category: "joueur",
  showComponents: false,
  components: [],
  editorFields: [
    {
      key: "IMAGE",
      label: "Image de la technique (339x146)",
      type: "image-url",
    },
    { key: "NOM", label: "Nom de la technique", type: "text" },
    { key: "TYPE", label: "Type de technique", type: "text" },
    { key: "DOMAINE", label: "Domaine/Capacité", type: "text" },
    {
      key: "RANG",
      label: "Rang",
      type: "select",
      options: [
        { value: "C", label: "C" },
        { value: "B", label: "B" },
        { value: "A", label: "A" },
        { value: "S", label: "S" },
      ],
    },
    {
      key: "PORTEE",
      label: "Portée",
      type: "select",
      options: [
        { value: "Personnelle", label: "Personnelle" },
        { value: "Contact", label: "Contact" },
        { value: "Faible", label: "Faible" },
        { value: "Moyenne", label: "Moyenne" },
        { value: "Grande", label: "Grande" },
        { value: "Énorme", label: "Énorme" },
      ],
    },
    {
      key: "CHAKRA",
      label: "Chakra",
      type: "select",
      options: [
        { value: "Infime", label: "Infime" },
        { value: "Faible", label: "Faible" },
        { value: "Moyen", label: "Moyen" },
        { value: "Fort", label: "Fort" },
        { value: "Très fort", label: "Très fort" },
        { value: "Énorme", label: "Énorme" },
        { value: "Colossal", label: "Colossal" },
        { value: "Effroyable", label: "Effroyable" },
      ],
    },
    { key: "DESCRIPTION", label: "Description", type: "textarea" },
  ],
  defaultValues: {
    IMAGE: "https://www.zupimages.net/up/26/18/p9iw.jpg",
    NOM: "Nom de la Technique",
    TYPE: "Type de Technique",
    DOMAINE: "Réponse ici",
    RANG: "C",
    PORTEE: "Personnelle",
    CHAKRA: "Infime",
    DESCRIPTION:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod turpis elit, non faucibus massa consectetur vel. Sed neque nibh, iaculis ac pellentesque a, commodo et libero. Vestibulum accumsan velit mi. Sed sed eros sit amet massa ullamcorper aliquet. Donec nibh risus, dictum quis consequat ac, malesuada ac justo.",
  },
};
