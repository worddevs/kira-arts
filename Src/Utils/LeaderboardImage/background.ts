import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { parseHex } from "../validations.utils";
import { CORNER_RADIUS, DEFAULT_ACCENT } from "./constants";
import { hexToRgba } from "./colorUtils";

export async function drawCardBackground(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  backgroundImage?: string,
  accentColor: string = DEFAULT_ACCENT,
): Promise<void> {
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#111318";
  ctx.fillRect(0, 0, width, height);

  const image = backgroundImage
    ? await loadImage(backgroundImage).catch(() => undefined)
    : undefined;

  if (image) {
    const scale = Math.max(width / image.width, height / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const dx = (width - drawW) / 2;
    const dy = (height - drawH) / 2;

    ctx.filter = "blur(6px) brightness(55%)";
    ctx.drawImage(image, dx, dy, drawW, drawH);
    ctx.filter = "none";

    ctx.fillStyle = "rgba(10, 11, 14, 0.55)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const glowTL = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.75);

    glowTL.addColorStop(0, hexToRgba(accentColor, 0.16));
    glowTL.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = glowTL;
    ctx.fillRect(0, 0, width, height);

    const glowBR = ctx.createRadialGradient(width, height, 0, width, height, width * 0.6);

    glowBR.addColorStop(0, hexToRgba(accentColor, 0.1));
    glowBR.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = glowBR;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.lineWidth = 1;

    const step = 34;

    for (let d = -height; d < width; d += step) {
      ctx.beginPath();
      ctx.moveTo(d, height);
      ctx.lineTo(d + height, 0);
      ctx.stroke();
    }
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.35)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function drawCardBorder(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  colors: string[],
): void {
  const thickness = 3;

  ctx.save();

  const grd = ctx.createLinearGradient(0, 0, width, height);
  for (let i = 0; i < colors.length; i++) {
    const stop = colors.length === 1 ? 0 : i / (colors.length - 1);

    grd.addColorStop(stop, parseHex(colors[i]));
  }

  ctx.strokeStyle = grd;
  ctx.shadowColor = hexToRgba(parseHex(colors[0]), 0.55);
  ctx.shadowBlur = 18;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.roundRect(thickness / 2, thickness / 2, width - thickness, height - thickness, [
    CORNER_RADIUS,
  ]);
  ctx.stroke();

  ctx.restore();
}
