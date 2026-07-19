import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import type { KiraBadge, KiraServerTag } from "../../@Types/index";

export async function drawServerTagPill(
  ctx: SKRSContext2D,
  serverTag: KiraServerTag,
): Promise<void> {
  const text = truncateText(serverTag.text, 12);
  const iconSize = serverTag.badgeURL ? 18 : 0;
  const paddingX = 10;
  const pillHeight = 26;
  const gap = iconSize ? 6 : 0;

  ctx.font = withFallback("13px Helvetica Bold");
  const textWidth = ctx.measureText(text).width;
  const pillWidth = paddingX * 2 + iconSize + gap + textWidth;
  const pillX = 16;
  const pillY = 16;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = "rgba(10, 10, 14, 0.55)";
  ctx.fill();
  ctx.restore();

  let cursorX = pillX + paddingX;

  if (iconSize && serverTag.badgeURL) {
    const badgeImage = await loadImage(serverTag.badgeURL).catch((_error: unknown) => {
      return undefined;
    });

    if (badgeImage) {
      ctx.drawImage(badgeImage, cursorX, pillY + (pillHeight - iconSize) / 2, iconSize, iconSize);
      cursorX += iconSize + gap;
    }
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = withFallback("13px Helvetica Bold");
  ctx.fillText(text, cursorX, pillY + pillHeight / 2 + 4);
}

export async function drawBadgesPill(
  ctx: SKRSContext2D,
  width: number,
  badges: KiraBadge[],
  maxBadges: number,
  iconSize = 20,
  pillHeight = 32,
): Promise<void> {
  const shown = badges.slice(0, maxBadges > 0 ? maxBadges : 3);
  if (!shown.length) return;

  const gap = Math.round(iconSize * 0.3);
  const paddingX = Math.round(iconSize * 0.5);
  const totalIconsWidth = shown.length * iconSize + (shown.length - 1) * gap;
  const pillWidth = paddingX * 2 + totalIconsWidth;
  const pillX = width - 16 - pillWidth;
  const pillY = 16;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = "rgba(10, 10, 14, 0.55)";
  ctx.fill();
  ctx.restore();

  let cursorX = pillX + paddingX;

  for (const badge of shown) {
    const badgeImage = await loadImage(badge.icon).catch(() => undefined);

    if (badgeImage) {
      ctx.drawImage(badgeImage, cursorX, pillY + (pillHeight - iconSize) / 2, iconSize, iconSize);
    }

    cursorX += iconSize + gap;
  }
}
