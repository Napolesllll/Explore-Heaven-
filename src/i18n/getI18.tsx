import { en } from "./en";
import { es } from "./es";

const LANGS = { en, es };

export function getI18n(lang: keyof typeof LANGS = "es") {
  return LANGS[lang];
}
