import { createCanvas } from "@napi-rs/canvas";

import { CARD_WIDTH, AVATAR_SIZE, AVATAR_BORDER, PADDING } from "./constants";
import type { BirthdayLayout } from "../../@Types/index";

export function getCardDimensions(layout: BirthdayLayout): { width: number; height: number } {
  const hasMessage = Boolean(layout.message);
  const hasPills = typeof layout.age === "number" || typeof layout.yearsInServer === "number";

  let textBlockHeight = 15 + 6 + 28;
  if (hasMessage) textBlockHeight += 10 + 17;
  if (hasPills) textBlockHeight += 12 + 30;

  const avatarBlockHeight = AVATAR_SIZE + AVATAR_BORDER * 2;
  const height = PADDING * 2 + Math.max(textBlockHeight, avatarBlockHeight);

  return { width: CARD_WIDTH, height: Math.round(height) };
}

export function createBirthdayCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
