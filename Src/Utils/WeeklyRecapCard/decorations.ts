import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";
import { DAY_LABELS } from "./constants";
import type { WeeklyRecapDayStat } from "../../@Types/index";

export function drawMessageIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const w = size;
  const h = size * 0.72;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, [size * 0.18]);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - w * 0.18, cy + h / 2 - 1);
  ctx.lineTo(cx - w * 0.02, cy + h / 2 - 1);
  ctx.lineTo(cx - w * 0.18, cy + h / 2 + size * 0.22);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(cx - w / 2 + size * 0.16, cy - h * 0.12, w * 0.5, size * 0.09);
  ctx.fillRect(cx - w / 2 + size * 0.16, cy + size * 0.03, w * 0.3, size * 0.09);
  ctx.restore();
}

export function drawVoiceIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.6, size * 0.1);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.roundRect(cx - r * 0.28, cy - r * 0.85, r * 0.56, r * 1.05, [r * 0.28]);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r * 0.55, 0.15 * Math.PI, 0.85 * Math.PI, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.45);
  ctx.lineTo(cx, cy + r * 0.72);
  ctx.moveTo(cx - r * 0.3, cy + r * 0.72);
  ctx.lineTo(cx + r * 0.3, cy + r * 0.72);
  ctx.stroke();
  ctx.restore();
}

export function drawBoltIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(r * 0.12, -r * 0.9);
  ctx.lineTo(-r * 0.55, r * 0.15);
  ctx.lineTo(-r * 0.05, r * 0.15);
  ctx.lineTo(-r * 0.12, r * 0.9);
  ctx.lineTo(r * 0.55, -r * 0.1);
  ctx.lineTo(r * 0.05, -r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawFlameIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy + r * 0.1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.05);
  ctx.bezierCurveTo(r * 0.65, -r * 0.5, r * 0.5, r * 0.05, r * 0.15, r * 0.05);
  ctx.bezierCurveTo(r * 0.3, -r * 0.15, r * 0.1, -r * 0.35, 0, -r * 0.4);
  ctx.bezierCurveTo(-r * 0.15, -r * 0.1, -r * 0.15, r * 0.25, r * 0.02, r * 0.35);
  ctx.bezierCurveTo(-r * 0.45, r * 0.4, -r * 0.62, -r * 0.1, -r * 0.28, -r * 0.55);
  ctx.bezierCurveTo(-r * 0.45, -r * 0.4, -r * 0.35, -r * 0.75, 0, -r * 1.05);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawStatTile(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  icon: (ctx: SKRSContext2D, cx: number, cy: number, size: number, color: string) => void,
  label: string,
  value: string,
  accent: string,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, [16]);
  ctx.fillStyle = hexToRgba("#000000", 0.26);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.3);
  ctx.lineWidth = 1;
  ctx.stroke();

  const iconCx = x + 30;
  const iconCy = y + h / 2;

  ctx.beginPath();
  ctx.arc(iconCx, iconCy, 18, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(accent, 0.18);
  ctx.fill();
  icon(ctx, iconCx, iconCy, 18, accent);

  ctx.textAlign = "left";
  ctx.font = withFallback("bold 18px Helvetica Bold");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(value, x + 58, y + h / 2 - 6);

  ctx.font = withFallback("11px Helvetica");
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillText(label.toUpperCase(), x + 58, y + h / 2 + 14);
  ctx.restore();
}

export function drawBarChart(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  days: WeeklyRecapDayStat[],
  accent: string,
): void {
  const data = days.length ? days : DAY_LABELS.map((label) => ({ label, value: 0 }));
  const maxValue = Math.max(1, ...data.map((d) => Math.max(0, d.value)));
  const gap = 18;
  const barWidth = (width - gap * (data.length - 1)) / data.length;
  const peakIndex = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);

  ctx.save();
  ctx.strokeStyle = hexToRgba("#FFFFFF", 0.08);
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const lineY = y + height - (height * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + width, lineY);
    ctx.stroke();
  }

  for (let i = 0; i < data.length; i++) {
    const value = Math.max(0, data[i].value);
    const barHeight = Math.max(6, (value / maxValue) * (height - 10));
    const barX = x + i * (barWidth + gap);
    const barY = y + height - barHeight;
    const isPeak = i === peakIndex && value > 0;

    if (isPeak) {
      ctx.shadowColor = hexToRgba(accent, 0.6);
      ctx.shadowBlur = 16;
    }

    const grd = ctx.createLinearGradient(0, barY, 0, y + height);
    grd.addColorStop(0, isPeak ? accent : hexToRgba(accent, 0.55));
    grd.addColorStop(1, hexToRgba(accent, 0.12));

    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, [8, 8, 3, 3]);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.textAlign = "center";
    ctx.font = withFallback(isPeak ? "bold 11px Helvetica Bold" : "11px Helvetica");
    ctx.fillStyle = isPeak ? "#FFFFFF" : "rgba(255, 255, 255, 0.55)";
    ctx.fillText(data[i].label, barX + barWidth / 2, y + height + 20);
  }

  ctx.restore();
}

export function drawTrendBadge(ctx: SKRSContext2D, x: number, y: number, change: number): number {
  const isUp = change >= 0;
  const color = isUp ? "#34D399" : "#F87171";
  const text = `${isUp ? "▲" : "▼"} ${Math.abs(change)}`;

  ctx.save();
  ctx.font = withFallback("bold 12px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const paddingX = 12;
  const pillWidth = textWidth + paddingX * 2;
  const pillHeight = 24;

  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = hexToRgba(color, 0.18);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.55);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x + pillWidth / 2, y + pillHeight / 2 + 1);
  ctx.restore();

  return pillWidth;
}
