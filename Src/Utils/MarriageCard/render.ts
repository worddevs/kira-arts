import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateText, truncateTextToWidth } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { CORNER_RADIUS, AVATAR_SIZE, AVATAR_BORDER, PADDING, DEFAULT_ACCENT } from "./constants";
import { drawPortraitAvatar } from "./avatar";
import { drawCenteredTag, drawCelebrationScatter } from "./decorations";
import type { MarriageLayout } from "../../@Types/index";

export async function drawMarriageCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: MarriageLayout,
): Promise<void> {
  const accentColor = layout.accentColor ? parseHex(layout.accentColor) : DEFAULT_ACCENT;
  const borderColors = layout.noBorder
    ? []
    : layout.borderColors?.length
      ? layout.borderColors
      : [accentColor];

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#0a0906";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = layout.customBackground
    ? await loadImage(layout.customBackground).catch(() => undefined)
    : undefined;

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(6, 5, 4, 0.68)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, "#1a140a");
    grd.addColorStop(1, "#0a0705");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      6,
      width / 2,
      height / 2,
      width * 0.55,
    );
    glow.addColorStop(0, hexToRgba(accentColor, 0.22));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  drawCelebrationScatter(ctx, width, height, accentColor);

  const avatarCy = height / 2;
  const leftCx = PADDING + AVATAR_SIZE / 2 + AVATAR_BORDER;
  const rightCx = width - leftCx;

  await drawPortraitAvatar(
    ctx,
    leftCx,
    avatarCy,
    AVATAR_SIZE,
    AVATAR_BORDER,
    layout.leftAvatarUrl,
    accentColor,
  );
  await drawPortraitAvatar(
    ctx,
    rightCx,
    avatarCy,
    AVATAR_SIZE,
    AVATAR_BORDER,
    layout.rightAvatarUrl,
    accentColor,
  );

  const hasInfo = Boolean(layout.dateText) || typeof layout.daysTogether === "number";
  const hasVows = Boolean(layout.vows);

  let blockHeight = 24 + 10 + 26;
  if (hasInfo) blockHeight += 10 + 15;
  if (hasVows) blockHeight += 10 + 16;

  const textMaxWidth =
    rightCx - AVATAR_SIZE / 2 - AVATAR_BORDER - (leftCx + AVATAR_SIZE / 2 + AVATAR_BORDER) - 32;

  ctx.textAlign = "center";
  let cursorY = avatarCy - blockHeight / 2;

  drawCenteredTag(ctx, width / 2, cursorY, "💍 MARRIED", accentColor);
  cursorY += 24 + 10 + 26;

  ctx.font = withFallback("bold 22px Gelasio");
  ctx.fillStyle = "#FDF6E3";
  const names = `${truncateText(layout.leftUsername, 14)} & ${truncateText(layout.rightUsername, 14)}`;
  ctx.fillText(truncateTextToWidth(ctx, names, textMaxWidth), width / 2, cursorY);

  if (hasInfo) {
    cursorY += 10 + 15;
    const parts: string[] = [];
    if (layout.dateText) parts.push(`Since ${layout.dateText}`);
    if (typeof layout.daysTogether === "number") parts.push(`${layout.daysTogether} days together`);

    ctx.font = withFallback("13px Helvetica");
    ctx.fillStyle = hexToRgba(accentColor, 0.9);
    ctx.fillText(truncateTextToWidth(ctx, parts.join(" · "), textMaxWidth), width / 2, cursorY);
  }

  if (hasVows) {
    cursorY += 10 + 16;
    ctx.font = withFallback("italic 13px Gelasio");
    ctx.fillStyle = "rgba(253, 246, 227, 0.62)";
    ctx.fillText(
      `“${truncateTextToWidth(ctx, layout.vows!, textMaxWidth - 20)}”`,
      width / 2,
      cursorY,
    );
  }

  ctx.restore();

  if (borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, borderColors, CORNER_RADIUS - 2, 4);
  }
}
