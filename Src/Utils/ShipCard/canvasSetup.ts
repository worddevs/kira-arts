import { createCanvas } from "@napi-rs/canvas";

import { CARD_WIDTH, CARD_HEIGHT } from "./constants";

export interface ShipLayout {
  leftAvatarUrl: string;
  rightAvatarUrl: string;
  percentage: number;
  message: string;
  accentColor?: string;
  borderColors?: string[];
  noBorder?: boolean;
  customBackground?: string;
  heartColor?: string;
  shipName?: string;
  showText?: boolean;
}

export function getCardDimensions(): { width: number; height: number } {
  return { width: CARD_WIDTH, height: CARD_HEIGHT };
}

export function createShipCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
