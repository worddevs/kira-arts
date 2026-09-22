import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

export function drawInterlockingRings(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;
  const offset = r * 0.55;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2.4, size * 0.09);

  ctx.beginPath();
  ctx.arc(cx - offset, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx + offset, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawCenteredTag(
  ctx: SKRSContext2D,
  centerX: number,
  y: number,
  text: string,
  accent: string,
): number {
  ctx.save();
  ctx.font = withFallback("bold 11px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const paddingX = 12;
  const pillHeight = 24;
  const pillWidth = textWidth + paddingX * 2;
  const x = centerX - pillWidth / 2;

  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = hexToRgba(accent, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.55);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FDF6E3";
  ctx.fillText(text, centerX, y + pillHeight / 2 + 1);
  ctx.restore();

  return pillHeight;
}

function drawSparkleStar(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.18, -size * 0.18, size, 0);
  ctx.quadraticCurveTo(size * 0.18, size * 0.18, 0, size);
  ctx.quadraticCurveTo(-size * 0.18, size * 0.18, -size, 0);
  ctx.quadraticCurveTo(-size * 0.18, -size * 0.18, 0, -size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTinyHeart(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.32);
  ctx.bezierCurveTo(-size, -size * 0.5, -size * 0.5, -size, 0, -size * 0.28);
  ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.5, 0, size * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawCelebrationScatter(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  color: string,
): void {
  const rng = mulberry32(7331);
  const palette = [color, "#F4E4B0", "#FDF6E3"];

  for (let i = 0; i < 14; i++) {
    const x = rng() * width;
    const y = rng() * height;
    const size = 4 + rng() * 6;
    const kind = i % 3;
    const shapeColor = palette[i % palette.length];

    ctx.save();
    ctx.globalAlpha = 0.2 + rng() * 0.28;

    if (kind === 0) {
      drawSparkleStar(ctx, x, y, size, shapeColor);
    } else if (kind === 1) {
      drawTinyHeart(ctx, x, y, size, shapeColor);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = shapeColor;
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.globalAlpha = 1;
}
