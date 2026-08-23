import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

export function drawGiftIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;
  const boxWidth = r * 1.7;
  const boxHeight = r * 1.3;
  const lidHeight = r * 0.3;
  const lidOverhang = r * 0.08;
  const lidWidth = boxWidth + lidOverhang * 2;
  const lidGap = r * 0.14;
  const bowRx = r * 0.26;
  const bowRy = r * 0.22;

  const bowCenterY = bowRy;
  const lidTopY = bowCenterY + bowRy + lidGap;
  const lidBottomY = lidTopY + lidHeight;
  const boxTopY = lidBottomY;
  const boxBottomY = boxTopY + boxHeight;
  const offsetY = cy - boxBottomY / 2;

  ctx.save();
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.roundRect(cx - boxWidth / 2, offsetY + boxTopY, boxWidth, boxHeight, [2]);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(cx - r * 0.09, offsetY + boxTopY, r * 0.18, boxHeight);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(cx - lidWidth / 2, offsetY + lidTopY, lidWidth, lidHeight, [4]);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(cx - r * 0.09, offsetY + lidTopY, r * 0.18, lidHeight);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx - bowRx * 0.85, offsetY + bowCenterY, bowRx, bowRy, 0.5, 0, Math.PI * 2);
  ctx.ellipse(cx + bowRx * 0.85, offsetY + bowCenterY, bowRx, bowRy, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawStarIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.45;
  const step = Math.PI / spikes;
  let rot = -Math.PI / 2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);

  for (let i = 0; i < spikes; i++) {
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawClockIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.2, size * 0.1);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.55);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.4, cy + r * 0.15);
  ctx.stroke();

  ctx.restore();
}

export function drawTrophyIcon(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const r = size / 2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.09);

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy - r * 0.7);
  ctx.lineTo(cx + r * 0.55, cy - r * 0.7);
  ctx.lineTo(cx + r * 0.42, cy + r * 0.05);
  ctx.arc(cx, cy + r * 0.05, r * 0.42, 0, Math.PI, false);
  ctx.lineTo(cx - r * 0.42, cy + r * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy - r * 0.6);
  ctx.quadraticCurveTo(cx - r * 1.05, cy - r * 0.55, cx - r * 0.42, cy - r * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + r * 0.55, cy - r * 0.6);
  ctx.quadraticCurveTo(cx + r * 1.05, cy - r * 0.55, cx + r * 0.42, cy - r * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(cx - r * 0.1, cy + r * 0.42, r * 0.2, r * 0.32);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(cx - r * 0.45, cy + r * 0.7, r * 0.9, r * 0.18, [3]);
  ctx.fill();

  ctx.restore();
}

export function drawConfetti(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  colors: string[],
): void {
  const pieces: Array<[number, number, number, number]> = [
    [width * 0.08, height * 0.18, 4, 0.4],
    [width * 0.15, height * 0.42, 3, 0.3],
    [width * 0.06, height * 0.7, 5, 0.35],
    [width * 0.92, height * 0.2, 4, 0.4],
    [width * 0.86, height * 0.5, 3, 0.3],
    [width * 0.94, height * 0.75, 5, 0.35],
    [width * 0.5, height * 0.08, 3, 0.25],
  ];

  ctx.save();
  for (let i = 0; i < pieces.length; i++) {
    const [x, y, s, opacity] = pieces[i];
    const color = colors[i % colors.length];

    ctx.fillStyle = hexToRgba(color, opacity);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i * 37) % 360);
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.restore();
  }
  ctx.restore();
}

export function drawStatusPill(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  active: boolean,
  color: string,
): number {
  const text = active ? "ACTIVE" : "ENDED";

  ctx.save();
  ctx.font = withFallback("bold 12px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const paddingX = 14;
  const dotGap = 8;
  const dotSize = 7;
  const pillWidth = paddingX * 2 + dotSize + dotGap + textWidth;
  const pillHeight = 26;

  ctx.beginPath();
  ctx.roundRect(x - pillWidth, y, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = hexToRgba(color, 0.18);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.7);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - pillWidth + paddingX + dotSize / 2, y + pillHeight / 2, dotSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x - pillWidth + paddingX + dotSize + dotGap, y + pillHeight / 2 + 1);
  ctx.restore();

  return pillWidth;
}
