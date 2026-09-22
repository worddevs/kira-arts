import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";
import { TRAFFIC_LIGHT_COLORS } from "./constants";

export function drawTrafficLights(ctx: SKRSContext2D, x: number, y: number): void {
  const gap = 20;
  const radius = 6.5;

  for (let i = 0; i < TRAFFIC_LIGHT_COLORS.length; i++) {
    ctx.beginPath();
    ctx.arc(x + i * gap, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = TRAFFIC_LIGHT_COLORS[i];
    ctx.fill();
  }
}

export function measureFileTabWidth(ctx: SKRSContext2D, label: string): number {
  ctx.save();
  ctx.font = withFallback("bold 12.5px Cousine");
  const textWidth = ctx.measureText(label).width;
  ctx.restore();

  return textWidth + 14 * 2;
}

export function drawFileTab(
  ctx: SKRSContext2D,
  centerX: number,
  y: number,
  label: string,
  accent: string,
  textColor: string,
): number {
  ctx.save();
  ctx.font = withFallback("bold 12.5px Cousine");
  const textWidth = ctx.measureText(label).width;
  const paddingX = 14;
  const tabWidth = textWidth + paddingX * 2;
  const tabHeight = 28;
  const x = centerX - tabWidth / 2;

  ctx.beginPath();
  ctx.roundRect(x, y, tabWidth, tabHeight, [8]);
  ctx.fillStyle = hexToRgba(accent, 0.14);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.4);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 14, y + tabHeight / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;
  ctx.fillText(label, x + 24, y + tabHeight / 2 + 1);
  ctx.restore();

  return tabWidth;
}

export function drawLanguageBadge(
  ctx: SKRSContext2D,
  rightEdgeX: number,
  y: number,
  label: string,
  accent: string,
): void {
  ctx.save();
  ctx.font = withFallback("bold 11px Helvetica Bold");
  const textWidth = ctx.measureText(label.toUpperCase()).width;
  const paddingX = 12;
  const pillWidth = textWidth + paddingX * 2;
  const pillHeight = 22;
  const x = rightEdgeX - pillWidth;

  ctx.beginPath();
  ctx.roundRect(x, y, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = hexToRgba(accent, 0.16);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = accent;
  ctx.fillText(label.toUpperCase(), x + pillWidth / 2, y + pillHeight / 2 + 1);
  ctx.restore();
}
