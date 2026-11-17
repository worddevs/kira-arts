import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";

/**
 * Draws the "boost" gem: a faceted diamond tinted with the accent color.
 * `size` is the total width of the gem.
 */
export function drawBoostGem(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  accentColor: string,
): void {
  const half = size / 2;
  const crownTop = cy - half * 0.82;
  const crownBottom = cy - half * 0.28;
  const tip = cy + half * 0.92;
  const crownInset = half * 0.56;

  const outline = (): void => {
    ctx.beginPath();
    ctx.moveTo(cx - crownInset, crownTop);
    ctx.lineTo(cx + crownInset, crownTop);
    ctx.lineTo(cx + half, crownBottom);
    ctx.lineTo(cx, tip);
    ctx.lineTo(cx - half, crownBottom);
    ctx.closePath();
  };

  ctx.save();

  const body = ctx.createLinearGradient(cx - half, crownTop, cx + half, tip);
  body.addColorStop(0, "#FFFFFF");
  body.addColorStop(0.35, hexToRgba(accentColor, 1));
  body.addColorStop(1, hexToRgba(accentColor, 0.65));

  outline();
  ctx.fillStyle = body;
  ctx.fill();

  ctx.save();
  outline();
  ctx.clip();

  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.beginPath();
  ctx.moveTo(cx - crownInset, crownTop);
  ctx.lineTo(cx + crownInset, crownTop);
  ctx.lineTo(cx + half * 0.28, crownBottom);
  ctx.lineTo(cx - half * 0.28, crownBottom);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.beginPath();
  ctx.moveTo(cx + half * 0.28, crownBottom);
  ctx.lineTo(cx + half, crownBottom);
  ctx.lineTo(cx, tip);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = Math.max(1, size * 0.05);
  ctx.lineJoin = "round";

  outline();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - half, crownBottom);
  ctx.lineTo(cx + half, crownBottom);
  ctx.moveTo(cx - half * 0.28, crownBottom);
  ctx.lineTo(cx, tip);
  ctx.moveTo(cx + half * 0.28, crownBottom);
  ctx.lineTo(cx, tip);
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = Math.max(0.8, size * 0.03);
  ctx.stroke();

  ctx.restore();
}

function drawSparkle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  alpha: number,
): void {
  const r = size / 2;
  const waist = r * 0.22;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + waist, cy - waist, cx + r, cy);
  ctx.quadraticCurveTo(cx + waist, cy + waist, cx, cy + r);
  ctx.quadraticCurveTo(cx - waist, cy + waist, cx - r, cy);
  ctx.quadraticCurveTo(cx - waist, cy - waist, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Pixel rectangle where sparkles are skipped, so they never sit on top of text. */
export interface SparkleAvoidZone {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

// [x fraction, y fraction, size, alpha]
const SPARKLE_LAYOUT: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.07, 0.2, 14, 0.9],
  [0.16, 0.62, 8, 0.6],
  [0.27, 0.12, 9, 0.7],
  [0.36, 0.5, 6, 0.5],
  [0.64, 0.46, 6, 0.5],
  [0.73, 0.14, 10, 0.75],
  [0.84, 0.58, 8, 0.6],
  [0.93, 0.22, 15, 0.9],
];

/**
 * Scatters a fixed set of sparkles inside the rectangle (0, 0, width, height).
 * The positions are deterministic, so the same card always looks the same.
 * Sparkles whose center falls inside `avoid` are skipped.
 */
export function drawSparkleField(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  scale: number = 1,
  avoid?: SparkleAvoidZone,
): void {
  for (const [xFraction, yFraction, size, alpha] of SPARKLE_LAYOUT) {
    const x = width * xFraction;
    const y = height * yFraction;

    if (avoid && x >= avoid.x0 && x <= avoid.x1 && y >= avoid.y0 && y <= avoid.y1) continue;

    drawSparkle(ctx, x, y, size * scale, "#FFFFFF", alpha);
  }
}
