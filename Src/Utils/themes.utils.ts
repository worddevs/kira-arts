import { KiraError } from "./error.utils";
import type { KiraThemeName, KiraThemePalette } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export const THEMES: Record<KiraThemeName, KiraThemePalette> = {
  discord: {
    accentColor: "#5865F2",
    borderColor: ["#5865F2", "#404EED"],
    usernameColor: "#FFFFFF",
    tagColor: "#B5BAC1",
    messageColor: "#DBDEE1",
    levelColor: "#5865F2",
    barColor: ["#5865F2", "#404EED"],
    glowColor: "#5865F2",
    heartColor: "#FF4D6D",
  },
  midnight: {
    accentColor: "#7C3AED",
    borderColor: ["#312E81", "#7C3AED"],
    usernameColor: "#E0E7FF",
    tagColor: "#A5B4FC",
    messageColor: "#C7D2FE",
    levelColor: "#818CF8",
    barColor: ["#4338CA", "#7C3AED"],
    glowColor: "#818CF8",
    heartColor: "#F472B6",
  },
  sunset: {
    accentColor: "#F97316",
    borderColor: ["#F97316", "#EC4899"],
    usernameColor: "#FFF7ED",
    tagColor: "#FDBA74",
    messageColor: "#FED7AA",
    levelColor: "#FB923C",
    barColor: ["#F97316", "#EC4899"],
    glowColor: "#FB923C",
    heartColor: "#EC4899",
  },
  neon: {
    accentColor: "#22D3EE",
    borderColor: ["#22D3EE", "#D946EF"],
    usernameColor: "#ECFEFF",
    tagColor: "#67E8F9",
    messageColor: "#A5F3FC",
    levelColor: "#22D3EE",
    barColor: ["#22D3EE", "#D946EF"],
    glowColor: "#D946EF",
    heartColor: "#D946EF",
  },
  forest: {
    accentColor: "#22C55E",
    borderColor: ["#166534", "#22C55E"],
    usernameColor: "#F0FDF4",
    tagColor: "#86EFAC",
    messageColor: "#BBF7D0",
    levelColor: "#4ADE80",
    barColor: ["#166534", "#22C55E"],
    glowColor: "#4ADE80",
    heartColor: "#84CC16",
  },
  sakura: {
    accentColor: "#F472B6",
    borderColor: ["#FBCFE8", "#F472B6"],
    usernameColor: "#FDF2F8",
    tagColor: "#F9A8D4",
    messageColor: "#FBCFE8",
    levelColor: "#F472B6",
    barColor: ["#FBCFE8", "#F472B6"],
    glowColor: "#F9A8D4",
    heartColor: "#FB7185",
  },
  monochrome: {
    accentColor: "#9CA3AF",
    borderColor: ["#4B5563", "#D1D5DB"],
    usernameColor: "#F9FAFB",
    tagColor: "#9CA3AF",
    messageColor: "#D1D5DB",
    levelColor: "#E5E7EB",
    barColor: ["#4B5563", "#D1D5DB"],
    glowColor: "#D1D5DB",
    heartColor: "#9CA3AF",
  },
  gold: {
    accentColor: "#D4AF37",
    borderColor: ["#3F3F1F", "#D4AF37"],
    usernameColor: "#FEF9E7",
    tagColor: "#E9D8A6",
    messageColor: "#F5E6B8",
    levelColor: "#D4AF37",
    barColor: ["#3F3F1F", "#D4AF37"],
    glowColor: "#D4AF37",
    heartColor: "#D4AF37",
  },
};

export function getThemePalette(theme?: KiraThemeName): KiraThemePalette | undefined {
  if (!theme) return undefined;

  const palette = THEMES[theme];
  if (!palette) {
    throw new KiraError(
      `Invalid theme ('${theme}'), must be one of: ${Object.keys(THEMES).join(", ")}`,
      KiraErrorCode.Validation,
    );
  }

  return palette;
}
