import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba, loadImageSafe } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";

export async function drawRecapAvatar(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  border: number,
  url: string,
  accentColor: string,
): Promise<void> {
  const outerRadius = size / 2 + border;

  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  ctx.strokeStyle = hexToRgba(accentColor, 0.9);
  ctx.lineWidth = border;
  ctx.stroke();

  const avatarImage = await loadImageSafe(url);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.clip();

  if (avatarImage) {
    ctx.drawImage(avatarImage, cx - size / 2, cy - size / 2, size, size);
  } else {
    ctx.fillStyle = "#2b2d33";
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
    ctx.font = withFallback(`${Math.round(size * 0.4)}px Helvetica Bold`);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("?", cx, cy);
  }

  ctx.restore();
}
