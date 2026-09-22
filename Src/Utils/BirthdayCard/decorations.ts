import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

const BALLOON_PALETTE = ["#F472B6", "#FBBF24", "#60A5FA", "#34D399", "#F87171"];

function drawBalloon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  tilt: number,
): void {
  const rx = size * 0.42;
  const ry = size * 0.52;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  ctx.strokeStyle = hexToRgba("#FFFFFF", 0.25);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, ry);
  ctx.bezierCurveTo(rx * 0.6, ry + size * 0.55, -rx * 0.4, ry + size * 0.95, 0, ry + size * 1.3);
  ctx.stroke();

  const grd = ctx.createRadialGradient(-rx * 0.35, -ry * 0.4, 2, 0, 0, size * 0.65);
  grd.addColorStop(0, hexToRgba("#FFFFFF", 0.55));
  grd.addColorStop(0.25, color);
  grd.addColorStop(1, hexToRgba(color, 0.85));

  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-rx * 0.18, ry * 0.94);
  ctx.lineTo(rx * 0.18, ry * 0.94);
  ctx.lineTo(0, ry * 1.18);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

export function drawBalloonCluster(
  ctx: SKRSContext2D,
  originX: number,
  originY: number,
  side: "left" | "right",
  scale: number = 1,
): void {
  const direction = side === "left" ? 1 : -1;
  const layout: Array<[number, number, number, number]> = [
    [0, 0, 46 * scale, -0.12],
    [direction * 38 * scale, 18 * scale, 38 * scale, 0.16],
    [direction * -34 * scale, 26 * scale, 34 * scale, -0.2],
  ];

  for (let i = 0; i < layout.length; i++) {
    const [dx, dy, size, tilt] = layout[i];
    drawBalloon(
      ctx,
      originX + dx,
      originY + dy,
      size,
      BALLOON_PALETTE[i % BALLOON_PALETTE.length],
      tilt * direction,
    );
  }
}

export function drawCakeIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  accent: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = hexToRgba("#FFFFFF", 0.92);
  ctx.beginPath();
  ctx.roundRect(-r, r * 0.15, r * 2, r * 0.85, [4, 4, 10, 10]);
  ctx.fill();

  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.fillRect(-r, r * 0.15, r * 2, r * 0.22);

  ctx.fillStyle = hexToRgba("#FFFFFF", 0.98);
  ctx.beginPath();
  ctx.roundRect(-r * 0.72, -r * 0.35, r * 1.44, r * 0.55, [4]);
  ctx.fill();

  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.fillRect(-r * 0.72, -r * 0.15, r * 1.44, r * 0.16);

  for (let i = -1; i <= 1; i++) {
    const candleX = i * r * 0.5;
    ctx.fillStyle = "#FDE68A";
    ctx.fillRect(candleX - 2.5, -r * 0.75, 5, r * 0.42);

    const flameGrd = ctx.createRadialGradient(candleX, -r * 0.85, 1, candleX, -r * 0.85, 8);
    flameGrd.addColorStop(0, "#FFF7D6");
    flameGrd.addColorStop(0.6, "#FBBF24");
    flameGrd.addColorStop(1, hexToRgba("#F97316", 0));
    ctx.fillStyle = flameGrd;
    ctx.beginPath();
    ctx.ellipse(candleX, -r * 0.85, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawConfettiBurst(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  accent: string,
): void {
  const palette = [accent, "#FBBF24", "#60A5FA", "#34D399", "#FFFFFF"];
  const rng = mulberry32(1337);

  for (let i = 0; i < 46; i++) {
    const x = rng() * width;
    const y = rng() * height;
    const size = 3 + rng() * 5;
    const color = palette[i % palette.length];
    const shape = i % 3;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rng() * Math.PI * 2);
    ctx.globalAlpha = 0.16 + rng() * 0.22;
    ctx.fillStyle = color;

    if (shape === 0) {
      ctx.fillRect(-size / 2, -size / 3, size, size * 0.66);
    } else if (shape === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

export function drawGlowRing(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
): void {
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
  glow.addColorStop(0, hexToRgba(color, 0.35));
  glow.addColorStop(1, hexToRgba(color, 0));

  ctx.save();
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawCornerTag(
  ctx: SKRSContext2D,
  rightEdgeX: number,
  y: number,
  text: string,
  accent: string,
): void {
  ctx.save();
  ctx.font = withFallback("bold 11px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const paddingX = 10;
  const pillHeight = 22;
  const pillWidth = textWidth + paddingX * 2;
  const x = rightEdgeX - pillWidth;

  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = "rgba(10, 10, 14, 0.55)";
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(text, x + pillWidth / 2, y + pillHeight / 2 + 1);
  ctx.restore();
}

export function drawChip(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  text: string,
  accent: string,
): number {
  ctx.save();
  ctx.font = withFallback("bold 12px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const paddingX = 12;
  const chipHeight = 28;
  const chipWidth = textWidth + paddingX * 2;

  ctx.beginPath();
  ctx.roundRect(x, y, chipWidth, chipHeight, [chipHeight / 2]);
  ctx.fillStyle = hexToRgba(accent, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(text, x + chipWidth / 2, y + chipHeight / 2 + 1);
  ctx.restore();

  return chipWidth;
}

export function measureChipWidth(ctx: SKRSContext2D, text: string): number {
  ctx.save();
  ctx.font = withFallback("bold 12px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  ctx.restore();

  return textWidth + 12 * 2;
}

export function drawSparkles(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  color: string,
): void {
  const rng = mulberry32(4242);
  const palette = [color, "#FBBF24", "#FFFFFF"];

  for (let i = 0; i < 10; i++) {
    const x = rng() * width;
    const y = rng() * height * 0.7;
    const size = 5 + rng() * 7;
    const rotation = rng() * Math.PI;
    const sparkleColor = palette[i % palette.length];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = 0.35 + rng() * 0.4;
    ctx.fillStyle = sparkleColor;

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

  ctx.globalAlpha = 1;
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
