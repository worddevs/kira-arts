import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba, loadImageSafe } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";
import { AVATAR_SIZE, AVATAR_BORDER } from "./constants";

export async function drawAvatarCircle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  url: string,
  accentColor: string,
): Promise<void> {
  const outerRadius = AVATAR_SIZE / 2 + AVATAR_BORDER;

  ctx.save();
  ctx.shadowColor = hexToRgba(accentColor, 0.55);
  ctx.shadowBlur = 26;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0c0d11";
  ctx.fill();
  ctx.restore();

  const ringGrd = ctx.createLinearGradient(cx, cy - outerRadius, cx, cy + outerRadius);
  ringGrd.addColorStop(0, hexToRgba(accentColor, 1));
  ringGrd.addColorStop(1, hexToRgba(accentColor, 0.55));

  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius - AVATAR_BORDER / 2, 0, Math.PI * 2);
  ctx.strokeStyle = ringGrd;
  ctx.lineWidth = AVATAR_BORDER;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius + 2, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const avatarImage = await loadImageSafe(url);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();

  if (avatarImage) {
    ctx.drawImage(
      avatarImage,
      cx - AVATAR_SIZE / 2,
      cy - AVATAR_SIZE / 2,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );
  } else {
    ctx.fillStyle = "#2b2d33";
    ctx.fillRect(cx - AVATAR_SIZE / 2, cy - AVATAR_SIZE / 2, AVATAR_SIZE, AVATAR_SIZE);
    ctx.font = withFallback(`${Math.round(AVATAR_SIZE * 0.4)}px Helvetica Bold`);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("?", cx, cy);
  }

  ctx.restore();
}
