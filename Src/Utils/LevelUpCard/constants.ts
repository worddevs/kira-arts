import type { CardSize } from "../../@Types/index";

export const CARD_WIDTH = 700;
export const CARD_HEIGHT = 260;
export const CORNER_RADIUS = 26;
export const AVATAR_SIZE = 128;
export const AVATAR_BORDER = 5;

export const LEVEL_UP_SIZE_SCALE: Record<CardSize, number> = {
  compact: 0.8,
  standard: 1,
  wide: 1.2,
};
