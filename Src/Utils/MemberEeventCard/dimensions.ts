import { createCanvas } from "@napi-rs/canvas";

import type { MemberEventLayout } from "./constants";
import { CARD_WIDTH, BANNER_HEIGHT, BASE_AVATAR_SIZE } from "./constants";

export function normalizeFontScale(fontScale?: number): number {
  return fontScale && fontScale > 0 ? fontScale : 1;
}

export function computeAvatarSize(fontScale: number): number {
  const scale = 1 + (fontScale - 1) * 0.3;
  return Math.round(BASE_AVATAR_SIZE * scale);
}

export function computeBodyHeight(
  hasMessage: boolean,
  hasMemberCount: boolean,
  hasDate: boolean,
  fontScale: number,
): number {
  let h = 40 * fontScale;
  h += 38 * fontScale;
  if (hasMessage) h += 30 * fontScale;
  if (hasMemberCount) h += 28 * fontScale;
  if (hasDate) h += 24 * fontScale;
  h += 28;
  return h;
}

export function getCardDimensions(layout: MemberEventLayout): { width: number; height: number } {
  const hasMessage = Boolean(layout.message);
  const hasMemberCount = layout.memberCount != null;
  const hasDate = Boolean(layout.dateText);

  const fontScale = normalizeFontScale(layout.fontScale);
  const avatarSize = computeAvatarSize(fontScale);
  const bodyHeight = computeBodyHeight(hasMessage, hasMemberCount, hasDate, fontScale);
  const height = Math.round(BANNER_HEIGHT + avatarSize / 2 + bodyHeight);

  const baseAvatarSize = computeAvatarSize(1);
  const baseBodyHeight = computeBodyHeight(hasMessage, hasMemberCount, hasDate, 1);
  const baseHeight = BANNER_HEIGHT + baseAvatarSize / 2 + baseBodyHeight;

  const aspectRatio = CARD_WIDTH / baseHeight;
  const width = Math.round(height * aspectRatio);

  return { width, height };
}

export function createMemberEventCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
