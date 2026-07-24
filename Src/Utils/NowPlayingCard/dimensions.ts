import { createCanvas } from "@napi-rs/canvas";

import { CARD_WIDTH, CARD_HEIGHT } from "./constants";

export function getCardDimensions(
  customWidth?: number,
  customHeight?: number,
): { width: number; height: number } {
  return {
    width: customWidth && customWidth > 0 ? customWidth : CARD_WIDTH,
    height: customHeight && customHeight > 0 ? customHeight : CARD_HEIGHT,
  };
}

export function createNowPlayingCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);

  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
