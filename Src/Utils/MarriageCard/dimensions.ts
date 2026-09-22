import { createCanvas } from "@napi-rs/canvas";

import { CARD_WIDTH, AVATAR_SIZE, AVATAR_BORDER, PADDING } from "./constants";
import type { MarriageLayout } from "../../@Types/index";

export function getCardDimensions(layout: MarriageLayout): { width: number; height: number } {
  const hasInfo = Boolean(layout.dateText) || typeof layout.daysTogether === "number";
  const hasVows = Boolean(layout.vows);

  let textBlockHeight = 24 + 10 + 26;
  if (hasInfo) textBlockHeight += 10 + 15;
  if (hasVows) textBlockHeight += 10 + 16;

  const avatarBlockHeight = AVATAR_SIZE + AVATAR_BORDER * 2;
  const height = PADDING * 2 + Math.max(textBlockHeight, avatarBlockHeight);

  return { width: CARD_WIDTH, height: Math.round(height) };
}

export function createMarriageCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
