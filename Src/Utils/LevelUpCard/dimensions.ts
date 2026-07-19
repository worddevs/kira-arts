import { createCanvas } from "@napi-rs/canvas";

import { CARD_WIDTH, CARD_HEIGHT } from "./constants";

export function getCardDimensions(): { width: number; height: number } {
  return { width: CARD_WIDTH, height: CARD_HEIGHT };
}

export function createLevelUpCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
