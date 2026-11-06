import type { CardSize } from "../../@Types/index";

export const CORNER_RADIUS = 28;
export const BANNER_HEIGHT = 170;
export const BASE_AVATAR_SIZE = 190;
export const AVATAR_BORDER = 6;

export const DEFAULT_ACCENT = "#FF73FA";
export const CARD_BACKGROUND = "#111318";

export const CENTERED_WIDTH_PRESET: Record<CardSize, number> = {
  compact: 560,
  standard: 700,
  wide: 940,
};

export const CENTERED_FONT_SCALE: Record<CardSize, number> = {
  compact: 0.92,
  standard: 1,
  wide: 1.1,
};

export const BANNER_DIMENSIONS: Record<CardSize, { width: number; height: number }> = {
  compact: { width: 480, height: 170 },
  standard: { width: 700, height: 200 },
  wide: { width: 980, height: 230 },
};

export const BANNER_SIZE_SCALE: Record<CardSize, number> = {
  compact: 0.85,
  standard: 1,
  wide: 1.15,
};

export const BANNER_AVATAR_SIZE = 150;
export const BANNER_AVATAR_BORDER = 5;
export const BANNER_PADDING = 30;
