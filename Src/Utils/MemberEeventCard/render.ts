import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import type {
  MemberEventLayout} from "./constants";
import {
  CORNER_RADIUS,
  BANNER_HEIGHT,
  BASE_AVATAR_SIZE,
  AVATAR_BORDER
} from "./constants";
import { normalizeFontScale, computeAvatarSize } from "./dimensions";
import { applyTextEffect } from "./textEffects";
import { drawServerTagPill, drawBadgesPill } from "./pills";

export async function drawMemberEventCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
): Promise<void> {
  const fontScale = normalizeFontScale(layout.fontScale);
  const avatarSize = computeAvatarSize(fontScale);
  const avatarBorder = Math.max(4, Math.round(AVATAR_BORDER * (avatarSize / BASE_AVATAR_SIZE)));
  const avatarBorderColor = layout.avatarBorderColor
    ? parseHex(layout.avatarBorderColor)
    : layout.accentColor;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#111318";
  ctx.fillRect(0, 0, width, height);

  const bannerImage = layout.customBackground
    ? await loadImage(layout.customBackground).catch(() => undefined)
    : undefined;

  if (bannerImage) {
    drawCoverImage(ctx, bannerImage, 0, 0, width, height);

    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, "rgba(8, 9, 12, 0.1)");
    overlay.addColorStop(0.3, "rgba(8, 9, 12, 0.3)");
    overlay.addColorStop(0.55, "rgba(13, 15, 20, 0.55)");
    overlay.addColorStop(1, "rgba(13, 15, 20, 0.9)");
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, BANNER_HEIGHT);
    grd.addColorStop(0, hexToRgba(layout.accentColor, 0.85));
    grd.addColorStop(1, hexToRgba(layout.accentColor, 0.3));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, BANNER_HEIGHT);
  }

  if (layout.serverTag) {
    await drawServerTagPill(ctx, layout.serverTag);
  }

  if (layout.badges?.length) {
    await drawBadgesPill(ctx, width, layout.badges, layout.maxBadges ?? 3);
  }

  const avatarCx = width / 2;
  const avatarCy = BANNER_HEIGHT;
  const outerRadius = avatarSize / 2 + avatarBorder;

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#111318";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, outerRadius - avatarBorder / 2, 0, Math.PI * 2);
  ctx.strokeStyle = avatarBorderColor;
  ctx.lineWidth = avatarBorder;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, avatarSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#292b2f";
  ctx.fill();

  const avatarImage = await loadImage(avatarUrl).catch(() => undefined);
  if (avatarImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      avatarImage,
      avatarCx - avatarSize / 2,
      avatarCy - avatarSize / 2,
      avatarSize,
      avatarSize,
    );
    ctx.restore();
  }

  const avatarFrameImage = layout.avatarFrameUrl
    ? await loadImage(layout.avatarFrameUrl).catch(() => undefined)
    : undefined;

  if (avatarFrameImage) {
    const frameSize = avatarSize * 1.2;
    ctx.drawImage(
      avatarFrameImage,
      avatarCx - frameSize / 2,
      avatarCy - frameSize / 2,
      frameSize,
      frameSize,
    );
  }

  let cursorY = BANNER_HEIGHT + avatarSize / 2 + 44 * fontScale;
  const glowColor = layout.glowColor ? parseHex(layout.glowColor) : layout.accentColor;

  ctx.textAlign = "center";
  applyTextEffect(ctx, layout.usernameEffect, glowColor);
  ctx.font = withFallback(`${Math.round(30 * fontScale)}px Helvetica Bold`);
  ctx.fillStyle = layout.usernameColor ? parseHex(layout.usernameColor) : "#FFFFFF";
  ctx.fillText(truncateText(username, 24), width / 2, cursorY);

  if (layout.message) {
    cursorY += 32 * fontScale;
    applyTextEffect(ctx, layout.messageEffect, glowColor);
    ctx.font = withFallback(`${Math.round(18 * fontScale)}px Helvetica`);
    ctx.fillStyle = layout.messageColor
      ? parseHex(layout.messageColor)
      : "rgba(255, 255, 255, 0.85)";
    ctx.fillText(truncateText(layout.message, 64), width / 2, cursorY);
  }

  applyTextEffect(ctx, "none", glowColor);

  if (layout.memberCount != null) {
    cursorY += 30 * fontScale;
    ctx.font = withFallback(`bold ${Math.round(16 * fontScale)}px Helvetica Bold`);
    ctx.fillStyle = hexToRgba(layout.accentColor, 1);
    ctx.fillText(`Miembro #${layout.memberCount}`, width / 2, cursorY);
  }

  if (layout.dateText) {
    cursorY += 26 * fontScale;
    ctx.font = withFallback(`${Math.round(14 * fontScale)}px Helvetica`);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(layout.dateText, width / 2, cursorY);
  }

  ctx.restore();

  if (layout.borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, layout.borderColors, CORNER_RADIUS);
  }
}
