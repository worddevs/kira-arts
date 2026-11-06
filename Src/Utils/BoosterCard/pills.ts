import { type SKRSContext2D, loadImage } from "@napi-rs/canvas";

import { truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import type { KiraServerTag } from "../../@Types/index";
import { drawBoostGem } from "./decorations";

const PILL_BACKGROUND = "rgba(10, 10, 14, 0.55)";

export type PillAlign = "center" | "right";

function resolvePillX(anchorX: number, pillWidth: number, align: PillAlign): number {
  return align === "center" ? anchorX - pillWidth / 2 : anchorX - pillWidth;
}

/**
 * Draws the "NEW BOOSTER" pill. `anchorX` is the card center for `"center"`
 * and the right edge of the pill for `"right"`. Returns the pill height.
 */
export function drawBoosterKindPill(
  ctx: SKRSContext2D,
  anchorX: number,
  pillY: number,
  label: string,
  accentColor: string,
  align: PillAlign,
  compact: boolean = false,
  showIcon: boolean = true,
): number {
  const pillHeight = compact ? 22 : 26;
  const fontSize = compact ? 11 : 12;
  const paddingX = compact ? 10 : 12;
  const iconSize = showIcon ? (compact ? 11 : 13) : 0;
  const gap = showIcon ? (compact ? 6 : 8) : 0;

  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  const textWidth = ctx.measureText(label).width;
  const pillWidth = paddingX * 2 + iconSize + gap + textWidth;
  const pillX = resolvePillX(anchorX, pillWidth, align);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = PILL_BACKGROUND;
  ctx.fill();
  ctx.restore();

  if (showIcon) {
    drawBoostGem(
      ctx,
      pillX + paddingX + iconSize / 2,
      pillY + pillHeight / 2,
      iconSize,
      accentColor,
    );
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  ctx.fillText(label, pillX + paddingX + iconSize + gap, pillY + pillHeight / 2 + 4);

  return pillHeight;
}

/**
 * Draws the server tag pill. `anchorX` is the left edge of the pill for
 * `"left"` and the right edge of the pill for `"right"`.
 */
export async function drawBoosterServerTagPill(
  ctx: SKRSContext2D,
  serverTag: KiraServerTag,
  anchorX: number,
  pillY: number,
  align: "left" | "right",
  compact: boolean = false,
): Promise<void> {
  const text = truncateText(serverTag.text, 12);
  const pillHeight = compact ? 22 : 26;
  const fontSize = compact ? 12 : 13;
  const iconSize = serverTag.badgeURL ? (compact ? 16 : 18) : 0;
  const paddingX = compact ? 9 : 10;
  const gap = iconSize ? (compact ? 5 : 6) : 0;

  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  const textWidth = ctx.measureText(text).width;
  const pillWidth = paddingX * 2 + iconSize + gap + textWidth;
  const pillX = align === "left" ? anchorX : anchorX - pillWidth;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fillStyle = PILL_BACKGROUND;
  ctx.fill();
  ctx.restore();

  let cursorX = pillX + paddingX;

  if (iconSize && serverTag.badgeURL) {
    const badgeImage = await loadImage(serverTag.badgeURL).catch(() => undefined);

    if (badgeImage) {
      ctx.drawImage(badgeImage, cursorX, pillY + (pillHeight - iconSize) / 2, iconSize, iconSize);
      cursorX += iconSize + gap;
    }
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = withFallback(`${fontSize}px Helvetica Bold`);
  ctx.fillText(text, cursorX, pillY + pillHeight / 2 + 4);
}
