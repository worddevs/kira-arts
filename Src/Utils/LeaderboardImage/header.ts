import type { SKRSContext2D } from "@napi-rs/canvas";

import { withFallback } from "../fonts.utils";
import { PADDING } from "./constants";
import { hexToRgba } from "./colorUtils";

export function drawTrophyIcon(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  const s = size / 24;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.1 * s;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(4 * s, 6.5 * s, 3 * s, Math.PI * 0.15, Math.PI * 1.85, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(20 * s, 6.5 * s, 3 * s, Math.PI * 1.15, Math.PI * 0.85, true);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(7 * s, 3 * s);
  ctx.lineTo(17 * s, 3 * s);
  ctx.lineTo(17 * s, 8 * s);
  ctx.quadraticCurveTo(17 * s, 14.5 * s, 12 * s, 14.5 * s);
  ctx.quadraticCurveTo(7 * s, 14.5 * s, 7 * s, 8 * s);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(10.5 * s, 14.5 * s, 3 * s, 3.5 * s);

  ctx.beginPath();
  ctx.roundRect(6 * s, 18 * s, 12 * s, 3 * s, [1.5 * s]);
  ctx.fill();

  ctx.restore();
}

export function drawHeader(
  ctx: SKRSContext2D,
  title: string,
  subtitle: string | undefined,
  accentColor: string,
): void {
  const iconSize = 26;
  const iconY = PADDING + 2;

  drawTrophyIcon(ctx, PADDING, iconY, iconSize, accentColor);

  ctx.font = withFallback("30px Helvetica Bold");
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";

  ctx.fillText(title, PADDING + iconSize + 14, PADDING + 30);

  if (subtitle) {
    ctx.font = withFallback("18px Helvetica");
    ctx.fillStyle = hexToRgba(accentColor, 0.85);
    ctx.fillText(subtitle, PADDING, PADDING + 56);
  }
}
