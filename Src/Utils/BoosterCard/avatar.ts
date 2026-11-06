import type { Canvas, Image, SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { CARD_BACKGROUND } from "./constants";
import { drawBoostGem } from "./decorations";

export interface BoosterAvatarParams {
  cx: number;
  cy: number;
  size: number;
  border: number;
  borderColor: string;
  accentColor: string;
  image?: Canvas | Image;
  frameUrl?: string | null;
  showBoostIcon: boolean;
}

export async function drawBoosterAvatar(
  ctx: SKRSContext2D,
  params: BoosterAvatarParams,
): Promise<void> {
  const { cx, cy, size, border, borderColor, accentColor, image, frameUrl, showBoostIcon } = params;
  const outerRadius = size / 2 + border;

  ctx.save();
  ctx.shadowColor = hexToRgba(accentColor, 0.55);
  ctx.shadowBlur = 26;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = CARD_BACKGROUND;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius - border / 2, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = border;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#292b2f";
  ctx.fill();

  if (image) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, cx - size / 2, cy - size / 2, size, size);
    ctx.restore();
  }

  const frameImage = frameUrl ? await loadImage(frameUrl).catch(() => undefined) : undefined;

  if (frameImage) {
    const frameSize = size * 1.2;
    ctx.drawImage(frameImage, cx - frameSize / 2, cy - frameSize / 2, frameSize, frameSize);
  }

  if (showBoostIcon) {
    const offset = (size / 2) * Math.SQRT1_2 + border * 0.2;
    const badgeX = cx + offset;
    const badgeY = cy + offset;
    const badgeRadius = Math.max(14, size * 0.17);

    ctx.save();
    ctx.shadowColor = hexToRgba(accentColor, 0.7);
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    ctx.fillStyle = CARD_BACKGROUND;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(accentColor, 1);
    ctx.lineWidth = 3;
    ctx.stroke();

    drawBoostGem(ctx, badgeX, badgeY, badgeRadius * 1.25, accentColor);
  }
}
