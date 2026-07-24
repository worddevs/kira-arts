import type { ColorValue } from "../Utils/validations.utils";
import type { ColorInput } from "./common";
import type { Image } from "@napi-rs/canvas";

export type KiraThemeName =
  "discord" | "midnight" | "sunset" | "neon" | "forest" | "sakura" | "monochrome" | "gold";

export interface KiraThemePalette {
  accentColor: string;
  borderColor: string[];
  usernameColor: string;
  tagColor: string;
  messageColor: string;
  levelColor: string;
  barColor: string[];
  glowColor: string;
  heartColor: string;
}

export type KiraNameplatePalette =
  | "berry"
  | "bubble_gum"
  | "clover"
  | "cobalt"
  | "crimson"
  | "forest"
  | "lemon"
  | "sky"
  | "teal"
  | "violet"
  | "white";

export interface ColorResolutionSources {
  custom?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  nitroColors?: string[] | null;
  useRoleColor?: boolean;
  roleColor?: string | null;
  fallback?: ColorValue[];
}

export interface CanvasBadge {
  canvas: Image;
  x: number;
  y: number;
  w: number;
}
