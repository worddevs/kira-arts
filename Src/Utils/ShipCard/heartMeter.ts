import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

export function traceHeartPath(
  ctx: SKRSContext2D,
  cx: number,
  topY: number,
  width: number,
  height: number,
): void {
  const halfW = width / 2;
  const lobeHeight = height * 0.3;
  const midY = topY + (height + lobeHeight) / 2;
  const bottomY = topY + height;

  ctx.moveTo(cx, topY + lobeHeight);
  ctx.bezierCurveTo(cx, topY, cx - halfW, topY, cx - halfW, topY + lobeHeight);
  ctx.bezierCurveTo(cx - halfW, midY, cx, midY, cx, bottomY);
  ctx.bezierCurveTo(cx, midY, cx + halfW, midY, cx + halfW, topY + lobeHeight);
  ctx.bezierCurveTo(cx + halfW, topY, cx, topY, cx, topY + lobeHeight);
}

export function drawHeartIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.beginPath();
  traceHeartPath(ctx, cx, cy - size / 2, size, size);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawHeartMeter(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number,
  percentage: number,
  fillColor: string,
): void {
  const topY = cy - height / 2;
  const bottomY = cy + height / 2;

  ctx.save();
  ctx.shadowColor = hexToRgba(fillColor, 0.55);
  ctx.shadowBlur = 22;
  ctx.beginPath();
  traceHeartPath(ctx, cx, topY, width, height);
  ctx.fillStyle = "rgba(8, 9, 13, 0.55)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  traceHeartPath(ctx, cx, topY, width, height);
  ctx.clip();

  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  ctx.fillRect(cx - width, topY, width * 2, height);

  const fillHeight = height * (percentage / 100);
  const startY = bottomY - fillHeight;

  ctx.beginPath();
  ctx.moveTo(cx - width, bottomY + 4);
  ctx.lineTo(cx - width, startY);

  for (let x = -width; x <= width; x += 6) {
    const waveY = startY + Math.sin((x + cx) * 0.08) * 4;
    ctx.lineTo(cx + x, waveY);
  }

  ctx.lineTo(cx + width, bottomY + 4);
  ctx.closePath();

  const fillGrd = ctx.createLinearGradient(0, startY, 0, bottomY);
  fillGrd.addColorStop(0, hexToRgba(fillColor, 0.95));
  fillGrd.addColorStop(1, hexToRgba(fillColor, 0.75));
  ctx.fillStyle = fillGrd;
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(cx - width, startY, width * 2, Math.max(4, fillHeight * 0.12));
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  traceHeartPath(ctx, cx, topY, width, height);
  ctx.clip();
  const shineGrd = ctx.createRadialGradient(
    cx - width * 0.28,
    topY + height * 0.32,
    2,
    cx - width * 0.28,
    topY + height * 0.32,
    width * 0.6,
  );
  shineGrd.addColorStop(0, "rgba(255, 255, 255, 0.28)");
  shineGrd.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = shineGrd;
  ctx.fillRect(cx - width, topY, width * 2, height);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  traceHeartPath(ctx, cx, topY, width, height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.font = withFallback(`bold ${Math.round(height * 0.19)}px Helvetica Bold`);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`${percentage}%`, cx, cy + height * 0.04);
  ctx.restore();
}
