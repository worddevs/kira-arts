import { createCanvas } from "@napi-rs/canvas";

import type { CardSize } from "../../@Types/index";
import { CARD_WIDTH, CARD_HEIGHT, LEVEL_UP_SIZE_SCALE } from "./constants";

export function normalizeSize(size?: CardSize): CardSize {
  return size === "compact" || size === "wide" ? size : "standard";
}

export function getSizeScale(size?: CardSize): number {
  return LEVEL_UP_SIZE_SCALE[normalizeSize(size)];
}

export function getCardDimensions(size?: CardSize): { width: number; height: number } {
  const scale = getSizeScale(size);

  return {
    width: Math.round(CARD_WIDTH * scale),
    height: Math.round(CARD_HEIGHT * scale),
  };
}

export function createLevelUpCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
