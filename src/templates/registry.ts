import type { FicheCategory, FicheConfig, FicheTemplate } from "@/types";
import { config as fichePresentationConfig } from "./fiche-de-presentation/config";
import fichePresentationHtml from "./fiche-de-presentation/template.html?raw";
import { config as ficheValidationConfig } from "./fiche-validation-presentation/config";
import ficheValidationHtml from "./fiche-validation-presentation/template.html?raw";
import { config as techniqueConfig } from "./technique/config";
import techniqueHtml from "./technique/template.html?raw";

const TEMPLATES: FicheTemplate[] = [
  { config: fichePresentationConfig, html: fichePresentationHtml },
  { config: techniqueConfig, html: techniqueHtml },
  { config: ficheValidationConfig, html: ficheValidationHtml },
];

const BY_SLUG = new Map(TEMPLATES.map((t) => [t.config.slug, t]));

export function getTemplate(slug: string): FicheTemplate | undefined {
  return BY_SLUG.get(slug);
}

export function getConfig(slug: string): FicheConfig | undefined {
  return BY_SLUG.get(slug)?.config;
}

export function listFiches(category: FicheCategory): FicheConfig[] {
  return TEMPLATES.map((t) => t.config).filter(
    (c) => c.category === category,
  );
}
