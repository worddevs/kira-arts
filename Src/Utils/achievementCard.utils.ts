import type { SKRSContext2D } from "@napi-rs/canvas";
import { createCanvas, loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "./canvasShared.utils";
import { parseHex } from "./validations.utils";
import { truncateText } from "./strings.utils";
import { withFallback } from "./fonts.utils";
import type { AchievementRarity, AchievementLayout } from "../@Types/index";

export const CARD_WIDTH = 700;
export const CARD_HEIGHT = 220;
export const CORNER_RADIUS = 24;
export const ICON_SIZE = 96;
export const ICON_MARGIN = 32;

const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: "#9AA3AF",
  rare: "#3B82F6",
  epic: "#A855F7",
  legendary: "#F59E0B",
};

const RARITY_LABELS: Record<AchievementRarity, string> = {
  common: "Common",
  rare: "Queer",
  epic: "Epic",
  legendary: "Legendary",
};

function resolveAccentColor(layout: AchievementLayout): string {
  if (layout.accentColor) return parseHex(layout.accentColor);
  const rarity = layout.rarity ?? "common";
  return RARITY_COLORS[rarity];
}

export function getCardDimensions(): { width: number; height: number } {
  return { width: CARD_WIDTH, height: CARD_HEIGHT };
}

export function createAchievementCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}

export async function drawAchievementCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: AchievementLayout,
): Promise<void> {
  const accentColor = resolveAccentColor(layout);
  const borderColors = layout.noBorder
    ? []
    : layout.borderColors?.length
      ? layout.borderColors
      : [accentColor];

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#111318";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = layout.customBackground
    ? await loadImage(layout.customBackground).catch(() => undefined)
    : undefined;

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    const overlay = ctx.createLinearGradient(0, 0, width, 0);
    overlay.addColorStop(0, "rgba(10, 11, 15, 0.9)");
    overlay.addColorStop(1, "rgba(10, 11, 15, 0.55)");
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, hexToRgba(accentColor, 0.22));
    grd.addColorStop(1, "rgba(17, 19, 24, 1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  const iconCx = ICON_MARGIN + ICON_SIZE / 2;
  const iconCy = height / 2;

  ctx.beginPath();
  ctx.arc(iconCx, iconCy, ICON_SIZE / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(accentColor, 0.18);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(iconCx, iconCy, ICON_SIZE / 2, 0, Math.PI * 2);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  const iconImage = layout.iconUrl
    ? await loadImage(layout.iconUrl).catch(() => undefined)
    : undefined;

  if (iconImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(iconCx, iconCy, ICON_SIZE / 2 - 6, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      iconImage,
      iconCx - ICON_SIZE / 2 + 6,
      iconCy - ICON_SIZE / 2 + 6,
      ICON_SIZE - 12,
      ICON_SIZE - 12,
    );
    ctx.restore();
  } else {
    ctx.font = withFallback(`${Math.round(ICON_SIZE * 0.45)}px Helvetica Bold`);
    ctx.textAlign = "center";
    ctx.fillStyle = accentColor;
    ctx.fillText("★", iconCx, iconCy + ICON_SIZE * 0.16);
  }

  const textX = ICON_MARGIN * 2 + ICON_SIZE;
  let cursorY = height / 2 - 30;

  ctx.textAlign = "left";

  if (layout.usernameLine) {
    ctx.font = withFallback("14px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fillText(truncateText(layout.usernameLine, 40), textX, cursorY);
    cursorY += 26;
  }

  const rarity = layout.rarity ?? "common";
  ctx.font = withFallback("12px Helvetica Bold");
  const rarityLabel = RARITY_LABELS[rarity].toUpperCase();
  const rarityWidth = ctx.measureText(rarityLabel).width;
  const rarityPadding = 8;
  const rarityHeight = 20;

  ctx.beginPath();
  ctx.roundRect(textX, cursorY - rarityHeight + 4, rarityWidth + rarityPadding * 2, rarityHeight, [
    rarityHeight / 2,
  ]);
  ctx.fillStyle = hexToRgba(accentColor, 0.25);
  ctx.fill();

  ctx.fillStyle = accentColor;
  ctx.fillText(rarityLabel, textX + rarityPadding, cursorY - 6);
  cursorY += 28;

  ctx.font = withFallback("26px Helvetica Bold");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(truncateText(layout.title, 34), textX, cursorY);
  cursorY += 30;

  if (layout.description) {
    ctx.font = withFallback("15px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(truncateText(layout.description, 60), textX, cursorY);
    cursorY += 24;
  }

  if (layout.progressText) {
    ctx.font = withFallback("13px Helvetica");
    ctx.fillStyle = hexToRgba(accentColor, 1);
    ctx.fillText(layout.progressText, textX, cursorY);
  }

  ctx.restore();

  if (borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, borderColors, CORNER_RADIUS);
  }
}
