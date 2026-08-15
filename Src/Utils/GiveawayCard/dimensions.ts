import { createCanvas } from "@napi-rs/canvas";

import type { GiveawayLayout } from "../../@Types/index";
import { CARD_WIDTH, BASE_HEIGHT, DESCRIPTION_ROW_HEIGHT, WINNER_ROW_HEIGHT } from "./constants";

export function getCardDimensions(layout: GiveawayLayout): { width: number; height: number } {
  let height = BASE_HEIGHT;

  if (layout.description) height += DESCRIPTION_ROW_HEIGHT;
  if (layout.winners && layout.winners.length > 0) height += WINNER_ROW_HEIGHT;

  return { width: CARD_WIDTH, height };
}

export function createGiveawayCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
