import { createCanvas } from "@napi-rs/canvas";

import type { BoosterLayout, CardSize } from "../../@Types/index";
import {
  BANNER_DIMENSIONS,
  BANNER_HEIGHT,
  BANNER_SIZE_SCALE,
  BASE_AVATAR_SIZE,
  CENTERED_FONT_SCALE,
  CENTERED_WIDTH_PRESET,
} from "./constants";

export function normalizeFontScale(fontScale?: number): number {
  return fontScale && fontScale > 0 ? fontScale : 1;
}

export function normalizeSize(size?: CardSize): CardSize {
  return size === "compact" || size === "wide" ? size : "standard";
}

export function computeEffectiveFontScale(layout: BoosterLayout): number {
  const fontScale = normalizeFontScale(layout.fontScale);
  const size = normalizeSize(layout.size);
  const sizeScale =
    layout.layoutStyle === "banner" ? BANNER_SIZE_SCALE[size] : CENTERED_FONT_SCALE[size];

  return fontScale * sizeScale;
}

export function computeAvatarSize(fontScale: number): number {
  const scale = 1 + (fontScale - 1) * 0.3;

  return Math.round(BASE_AVATAR_SIZE * scale);
}

export function computeBodyHeight(
  hasMessage: boolean,
  hasSecondaryMessage: boolean,
  hasBoostText: boolean,
  hasDate: boolean,
  fontScale: number,
): number {
  let h = 48 * fontScale;
  if (hasMessage) h += 34 * fontScale;
  if (hasSecondaryMessage) h += 28 * fontScale;
  if (hasBoostText) h += 32 * fontScale;
  if (hasDate) h += 28 * fontScale;
  h += 30;

  return h;
}

export function getCardDimensions(layout: BoosterLayout): { width: number; height: number } {
  if (layout.layoutStyle === "banner") {
    const preset = BANNER_DIMENSIONS[normalizeSize(layout.size)];

    return { width: preset.width, height: preset.height };
  }

  const fontScale = computeEffectiveFontScale(layout);
  const avatarSize = computeAvatarSize(fontScale);
  const bodyHeight = computeBodyHeight(
    Boolean(layout.message),
    Boolean(layout.secondaryMessage),
    Boolean(layout.boostText),
    Boolean(layout.dateText),
    fontScale,
  );
  const height = Math.round(BANNER_HEIGHT + avatarSize / 2 + bodyHeight);
  const width = CENTERED_WIDTH_PRESET[normalizeSize(layout.size)];

  return { width, height };
}

export function createBoosterCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
