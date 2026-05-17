export type FicheCategory = "joueur" | "administration";

export type EditorFieldType =
  | "text"
  | "textarea"
  | "image-url"
  | "color"
  | "select"
  | "toggle"
  | "chrono-list";

export interface ChronoEvent {
  an: string;
  texte: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface EditorFieldDefinition {
  /** Clé du placeholder (ex: "NOM" → {{NOM}} dans le template). */
  key: string;
  label: string;
  type: EditorFieldType;
  /** Aide affichée sous le champ. */
  hint?: string;
  placeholder?: string;
  /** Options pour le type "select". */
  options?: SelectOption[];
  /** Si renseigné, le champ n'apparaît que si ce composant est actif. */
  componentId?: string;
}

export interface ComponentDefinition {
  /** Identifiant du bloc, référencé par {{#id}}…{{/id}} dans le template. */
  id: string;
  label: string;
  description?: string;
  /** Actif par défaut à la création d'une sauvegarde. */
  defaultActive: boolean;
  /** Ordre par défaut (croissant). */
  defaultOrder: number;
}

export interface FicheConfig {
  slug: string;
  name: string;
  description?: string;
  category: FicheCategory;
  showComponents?: boolean;
  components: ComponentDefinition[];
  editorFields: EditorFieldDefinition[];
  defaultValues: Record<string, string>;
}

export interface FicheTemplate {
  config: FicheConfig;
  /** HTML brut du template avec placeholders. */
  html: string;
}

/** État d'un bloc dans une sauvegarde (ordre + activation). */
export interface ComponentState {
  id: string;
  active: boolean;
  order: number;
}

export interface SaveEntry {
  id: string;
  name: string;
  slug: string;
  ficheSlug: string;
  data: Record<string, string>;
  components: ComponentState[];
  createdAt: string;
  updatedAt: string;
}

/** Record<ficheSlug, SaveEntry[]> tel que stocké en localStorage. */
export type SaveStoreShape = Record<string, SaveEntry[]>;

export type ThemeMode = "dark" | "light";

export type SaveNamespace = "joueur" | "administration";
