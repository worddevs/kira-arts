import { ensureFontsRegistered } from "./fonts.utils";
import { parseHex } from "./validations.utils";
import { encodeCanvas } from "./output.utils";
import type { LeaderboardOptions } from "../@Types/index";
import type {
  ResolvedLeaderboardEntry} from "./LeaderboardImage/index";
import {
  CARD_WIDTH,
  DEFAULT_ACCENT,
  PADDING,
  ROW_GAP,
  ROW_HEIGHT,
  createLeaderboardCanvas,
  drawCardBackground,
  drawCardBorder,
  drawHeader,
  drawRow,
  getCardHeight,
  getHeaderHeight,
} from "./LeaderboardImage/index";

ensureFontsRegistered();

export async function genLeaderboardPng(
  resolvedEntries: ResolvedLeaderboardEntry[],
  options: LeaderboardOptions,
  borderColors: string[],
): Promise<Buffer> {
  const hasTitle = Boolean(options?.title);
  const hasSubtitle = Boolean(options?.subtitle);
  const height = getCardHeight(resolvedEntries.length, hasTitle, hasSubtitle);

  const { canvas, ctx } = createLeaderboardCanvas(height);

  const accentColor = options?.accentColor ? parseHex(options.accentColor) : DEFAULT_ACCENT;

  await drawCardBackground(ctx, CARD_WIDTH, height, options?.backgroundImage, accentColor);

  if (borderColors.length > 0) {
    drawCardBorder(ctx, CARD_WIDTH, height, borderColors);
  }

  if (hasTitle) {
    drawHeader(ctx, options.title as string, options.subtitle, accentColor);
  }

  const startY = PADDING + getHeaderHeight(hasTitle, hasSubtitle);

  for (let i = 0; i < resolvedEntries.length; i++) {
    const rowY = startY + i * (ROW_HEIGHT + ROW_GAP);
    await drawRow(ctx, resolvedEntries[i], rowY, options);
  }

  return encodeCanvas(canvas, options?.output);
}
