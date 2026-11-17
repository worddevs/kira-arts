import type { Canvas, Image, SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { CARD_BACKGROUND } from "./constants";
import { drawBoostGem } from "./decorations";
import { withFallback } from "../fonts.utils";

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
  /** When 2 or more, a small "x2" pill is drawn at the top-right of the boost gem. */
  boostMultiplier?: number;
}

export async function drawBoosterAvatar(
  ctx: SKRSContext2D,
  params: BoosterAvatarParams,
): Promise<void> {
  const {
    cx,
    cy,
    size,
    border,
    borderColor,
    accentColor,
    image,
    frameUrl,
    showBoostIcon,
    boostMultiplier,
  } = params;
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

    if (boostMultiplier != null && boostMultiplier > 1) {
      drawMultiplierPill(
        ctx,
        badgeX + badgeRadius * 0.5,
        badgeY - badgeRadius * 1.05,
        boostMultiplier,
        accentColor,
        badgeRadius,
      );
    }
  }
}

function drawMultiplierPill(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  multiplier: number,
  accentColor: string,
  badgeRadius: number,
): void {
  const label = `x${Math.min(multiplier, 99)}`;
  const fontSize = Math.max(11, Math.round(badgeRadius * 0.78));
  const height = Math.round(fontSize * 1.55);

  ctx.save();
  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  const width = Math.max(height, ctx.measureText(label).width + fontSize * 1.1);
  const x = cx - width / 2;
  const y = cy - height / 2;

  ctx.shadowColor = hexToRgba(accentColor, 0.7);
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [height / 2]);
  ctx.fillStyle = hexToRgba(accentColor, 1);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [height / 2]);
  ctx.strokeStyle = CARD_BACKGROUND;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  ctx.textAlign = "center";
  ctx.fillStyle = "#111318";
  ctx.fillText(label, cx, y + height / 2 + fontSize * 0.35);
  ctx.restore();
}
