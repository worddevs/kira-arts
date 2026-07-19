import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

export function drawSparkle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  opacity: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = hexToRgba(color, opacity);
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

export function drawSparkles(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  color: string,
): void {
  const spots: Array<[number, number, number, number]> = [
    [width * 0.31, height * 0.28, 5, 0.55],
    [width * 0.37, height * 0.68, 3.5, 0.4],
    [width * 0.62, height * 0.24, 4, 0.45],
    [width * 0.67, height * 0.7, 6, 0.5],
    [width * 0.5, height * 0.16, 3, 0.35],
  ];

  for (const [x, y, size, opacity] of spots) {
    drawSparkle(ctx, x, y, size, opacity, color);
  }
}

export function drawConnector(
  ctx: SKRSContext2D,
  fromX: number,
  toX: number,
  y: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = hexToRgba(color, 0.4);
  ctx.lineWidth = 2;
  ctx.setLineDash([1, 7]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.lineTo(toX, y);
  ctx.stroke();
  ctx.restore();
}

export function drawShipNamePill(
  ctx: SKRSContext2D,
  width: number,
  shipName: string,
  color: string,
): void {
  const safeName = shipName
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
  if (!safeName) return;

  ctx.save();
  ctx.font = withFallback("bold 15px Helvetica Bold");
  const paddingX = 16;
  const textWidth = ctx.measureText(safeName).width;
  const pillWidth = textWidth + paddingX * 2;
  const pillHeight = 30;
  const x = width - 24 - pillWidth;
  const y = 18;

  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);
  const grd = ctx.createLinearGradient(x, y, x + pillWidth, y);
  grd.addColorStop(0, hexToRgba(color, 0.9));
  grd.addColorStop(1, hexToRgba(color, 0.55));
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 4;
  ctx.fillText(safeName, x + pillWidth / 2, y + pillHeight / 2 + 1);
  ctx.restore();
}

export function drawVignette(ctx: SKRSContext2D, width: number, height: number): void {
  const grd = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.25,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75,
  );
  grd.addColorStop(0, "rgba(0, 0, 0, 0)");
  grd.addColorStop(1, "rgba(0, 0, 0, 0.45)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);
}
