import { createCanvas } from "@napi-rs/canvas";

import { PADDING, ROW_HEIGHT, ROW_GAP, CARD_WIDTH } from "./constants";

export function getHeaderHeight(hasTitle: boolean, hasSubtitle: boolean): number {
  if (!hasTitle) return 0;

  return hasSubtitle ? 96 : 68;
}

export function getCardHeight(rowCount: number, hasTitle: boolean, hasSubtitle: boolean): number {
  const header = getHeaderHeight(hasTitle, hasSubtitle);

  return PADDING * 2 + header + rowCount * ROW_HEIGHT + Math.max(0, rowCount - 1) * ROW_GAP;
}

export function createLeaderboardCanvas(height: number) {
  const canvas = createCanvas(CARD_WIDTH, height);

  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
