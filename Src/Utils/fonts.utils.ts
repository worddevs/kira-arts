import { GlobalFonts } from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";

import type { KiraFontFamily } from "../@Types/index";

let initialized = false;

export function ensureFontsRegistered(): void {
  if (initialized) return;
  initialized = true;

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const fontsDir = path.join(currentDir, "Public", "Fonts");

  GlobalFonts.registerFromPath(`${fontsDir}/HelveticaBold.ttf`, "Helvetica Bold");
  GlobalFonts.registerFromPath(`${fontsDir}/Helvetica.ttf`, "Helvetica");

  const bundledFonts: Array<[string, string]> = [
    ["Arimo.ttf", "Arimo"],
    ["Gelasio.ttf", "Gelasio"],
    ["Anton.ttf", "Anton"],
    ["Cousine-Regular.ttf", "Cousine"],
    ["Cousine-Bold.ttf", "Cousine"],
    ["MPLUSRounded1c-Bold.ttf", "MPLUS Rounded"],
    ["NotoSans-Bold.ttf", "Noto Sans"],
    ["NotoSansSymbols-Regular.ttf", "Noto Sans Symbols"],
    ["NotoSansSC-Regular.ttf", "Noto Sans SC"],
    ["NotoSansJP-Regular.ttf", "Noto Sans JP"],
    ["NotoColorEmoji-Regular.ttf", "Noto Color Emoji"],
    ["NotoSansSymbols2-Regular.ttf", "Noto Sans Symbols 2"],
  ];

  for (const [file, family] of bundledFonts) {
    try {
      GlobalFonts.registerFromPath(`${fontsDir}/${file}`, family);
    } catch {
      // return null;
    }
  }

  (GlobalFonts as unknown as { loadSystemFonts: () => number }).loadSystemFonts();
}

const FALLBACK_FAMILY_STACK =
  '"Noto Sans JP", "Noto Sans SC", "Noto Sans", "Noto Sans Symbols", "Noto Sans Symbols 2", "MPLUS Rounded", "Noto Color Emoji"';

export function withFallback(fontDeclaration: string): string {
  return `${fontDeclaration}, ${FALLBACK_FAMILY_STACK}`;
}

const FONT_FAMILY_STACKS: Record<KiraFontFamily, string> = {
  default: '"Helvetica"',
  arial: '"Arial", "Liberation Sans", "Arimo", "Helvetica"',
  impact: '"Impact", "Anton", "Helvetica Bold"',
  georgia: '"Georgia", "Gelasio", "Helvetica"',
  courierNew: '"Courier New", "Liberation Mono", "Cousine", "Courier", "Helvetica"',
  verdana: '"Verdana", "DejaVu Sans", "Helvetica"',
  tahoma: '"Tahoma", "DejaVu Sans", "Helvetica"',
};

export function resolveFont(
  size: number,
  family: KiraFontFamily | undefined,
  bold: boolean = false,
): string {
  const resolvedSize = Math.round(size);

  if (!family || family === "default") {
    const base = bold ? '"Helvetica Bold"' : '"Helvetica"';
    return `${resolvedSize}px ${base}, ${FALLBACK_FAMILY_STACK}`;
  }

  const stack = FONT_FAMILY_STACKS[family] ?? FONT_FAMILY_STACKS.default;
  const weightPrefix = bold ? "bold " : "";
  const boldSafetyNet = bold ? ', "Helvetica Bold"' : "";
  return `${weightPrefix}${resolvedSize}px ${stack}${boldSafetyNet}, ${FALLBACK_FAMILY_STACK}`;
}
