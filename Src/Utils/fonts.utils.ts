import { GlobalFonts } from "@napi-rs/canvas";
import path from "path";

let initialized = false;

export function ensureFontsRegistered(): void {
  if (initialized) return;
  initialized = true;

  const fontsDir = path.join(__dirname, "..", "..", "Public", "fonts");

  GlobalFonts.registerFromPath(`${fontsDir}/HelveticaBold.ttf`, "Helvetica Bold");
  GlobalFonts.registerFromPath(`${fontsDir}/Helvetica.ttf`, "Helvetica");

  const fallbackFonts: Array<[string, string]> = [
    ["MPLUSRounded1c-Bold.ttf", "MPLUS Rounded"],
    ["NotoSans-Bold.ttf", "Noto Sans"],
    ["NotoSansSymbols-Regular.ttf", "Noto Sans Symbols"],
    ["NotoSansSC-Regular.ttf", "Noto Sans SC"],
    ["NotoSansJP-Regular.ttf", "Noto Sans JP"],
    ["NotoColorEmoji-Regular.ttf", "Noto Color Emoji"],
    ["NotoSansSymbols2-Regular.ttf", "Noto Sans Symbols 2"],
  ];

  for (const [file, family] of fallbackFonts) {
    try {
      GlobalFonts.registerFromPath(`${fontsDir}/${file}`, family);
    } catch {
      // Si una fuente fallback no está disponible en el sistema, la ignoramos
      // intencionalmente: withFallback() ya incluye una cadena de fuentes
      // alternativas, así que perder una no rompe el renderizado.
    }
  }

  (GlobalFonts as unknown as { loadSystemFonts: () => number }).loadSystemFonts();
}

const FALLBACK_FAMILY_STACK =
  '"Noto Sans JP", "Noto Sans SC", "Noto Sans", "Noto Sans Symbols", "Noto Sans Symbols 2", "MPLUS Rounded", "Noto Color Emoji"';

export function withFallback(fontDeclaration: string): string {
  return `${fontDeclaration}, ${FALLBACK_FAMILY_STACK}`;
}
