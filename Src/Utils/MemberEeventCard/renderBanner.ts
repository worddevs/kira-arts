import { type SKRSContext2D, loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateTextToWidth, truncateText } from "../strings.utils";
import { resolveFont, withFallback } from "../fonts.utils";
import type { MemberEventLayout, MemberEventDrawOverrides, BannerLine } from "../../@Types/index";
import {
  CORNER_RADIUS,
  BANNER_AVATAR_SIZE,
  BANNER_AVATAR_BORDER,
  BANNER_PADDING,
} from "./constants";
import { computeEffectiveFontScale } from "./dimensions";
import { applyTextEffect } from "./textEffects";
import { drawBadgesPill } from "./pills";

export async function drawBannerMemberEventCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
  overrides?: MemberEventDrawOverrides,
): Promise<void> {
  const fontScale = computeEffectiveFontScale(layout);
  const padding = BANNER_PADDING * fontScale;
  const avatarSize = Math.round(BANNER_AVATAR_SIZE * fontScale);
  const avatarBorder = Math.max(3, Math.round(BANNER_AVATAR_BORDER * fontScale));
  const avatarBorderColor = layout.avatarBorderColor
    ? parseHex(layout.avatarBorderColor)
    : layout.accentColor;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#111318";
  ctx.fillRect(0, 0, width, height);

  const bannerImage =
    overrides?.backgroundImage ??
    (layout.customBackground
      ? await loadImage(layout.customBackground).catch(() => undefined)
      : undefined);

  if (bannerImage) {
    drawCoverImage(ctx, bannerImage, 0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, hexToRgba(layout.accentColor, 0.5));
    grd.addColorStop(1, hexToRgba(layout.accentColor, 0.08));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  const overlay = ctx.createLinearGradient(0, 0, width, 0);
  overlay.addColorStop(0, "rgba(8, 9, 12, 0.85)");
  overlay.addColorStop(0.5, "rgba(8, 9, 12, 0.55)");
  overlay.addColorStop(1, "rgba(8, 9, 12, 0.22)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  let cornerPillY = 14;
  const cornerPillRightPadding = 14;

  if (layout.kindLabel) {
    const dotColor = layout.kind === "welcome" ? "#3ba55d" : "#ed4245";
    const dotSize = 6;
    const paddingX = 10;
    const pillHeight = 22;
    const gap = 6;

    ctx.font = withFallback("11px Helvetica Bold");
    const textWidth = ctx.measureText(layout.kindLabel).width;
    const pillWidth = paddingX * 2 + dotSize + gap + textWidth;
    const pillX = width - cornerPillRightPadding - pillWidth;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pillX, cornerPillY, pillWidth, pillHeight, [pillHeight / 2]);
    ctx.fillStyle = "rgba(10, 10, 14, 0.6)";
    ctx.fill();
    ctx.restore();

    const dotCx = pillX + paddingX + dotSize / 2;
    const dotCy = cornerPillY + pillHeight / 2;
    ctx.beginPath();
    ctx.arc(dotCx, dotCy, dotSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = withFallback("11px Helvetica Bold");
    ctx.fillText(
      layout.kindLabel,
      pillX + paddingX + dotSize + gap,
      cornerPillY + pillHeight / 2 + 4,
    );

    cornerPillY += pillHeight + 6;
  }

  if (layout.serverTag) {
    const text = truncateText(layout.serverTag.text, 12);
    const iconSize = layout.serverTag.badgeURL ? 16 : 0;
    const paddingX = 9;
    const pillHeight = 22;
    const gap = iconSize ? 5 : 0;

    ctx.font = withFallback("12px Helvetica Bold");
    const textWidth = ctx.measureText(text).width;
    const pillWidth = paddingX * 2 + iconSize + gap + textWidth;
    const pillX = width - cornerPillRightPadding - pillWidth;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pillX, cornerPillY, pillWidth, pillHeight, [pillHeight / 2]);
    ctx.fillStyle = "rgba(10, 10, 14, 0.6)";
    ctx.fill();
    ctx.restore();

    let iconCursorX = pillX + paddingX;

    if (iconSize && layout.serverTag.badgeURL) {
      const badgeImage = await loadImage(layout.serverTag.badgeURL).catch(() => undefined);
      if (badgeImage) {
        ctx.drawImage(
          badgeImage,
          iconCursorX,
          cornerPillY + (pillHeight - iconSize) / 2,
          iconSize,
          iconSize,
        );
        iconCursorX += iconSize + gap;
      }
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = withFallback("12px Helvetica Bold");
    ctx.fillText(text, iconCursorX, cornerPillY + pillHeight / 2 + 4);
  }

  if (layout.badges?.length) {
    const badgesPillHeight = 26;
    const badgesPillY = height - badgesPillHeight - 14;
    await drawBadgesPill(
      ctx,
      width,
      layout.badges,
      layout.maxBadges ?? 3,
      18,
      badgesPillHeight,
      badgesPillY,
    );
  }

  const avatarCx = padding + avatarSize / 2 + avatarBorder;
  const avatarCy = height / 2;
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

  const avatarImage = overrides?.avatarImage ?? (await loadImage(avatarUrl).catch(() => undefined));
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

  const textX = avatarCx + avatarSize / 2 + avatarBorder + 26 * fontScale;
  const textMaxWidth = Math.max(40, width - textX - padding);
  const glowColor = layout.glowColor ? parseHex(layout.glowColor) : layout.accentColor;

  const lines: BannerLine[] = [];

  lines.push({
    text: username,
    size: 30 * fontScale,
    gapBefore: 0,
    bold: true,
    color: layout.usernameColor ? parseHex(layout.usernameColor) : "#FFFFFF",
    effect: layout.usernameEffect,
  });

  if (layout.message) {
    lines.push({
      text: layout.message,
      size: 20 * fontScale,
      gapBefore: 14 * fontScale,
      bold: false,
      color: layout.messageColor ? parseHex(layout.messageColor) : "rgba(255, 255, 255, 0.85)",
      effect: layout.messageEffect,
    });
  }

  if (layout.secondaryMessage) {
    lines.push({
      text: layout.secondaryMessage,
      size: 16 * fontScale,
      gapBefore: 9 * fontScale,
      bold: false,
      color: layout.secondaryMessageColor
        ? parseHex(layout.secondaryMessageColor)
        : "rgba(255, 255, 255, 0.6)",
    });
  }

  if (layout.memberCount != null && layout.memberCountText) {
    lines.push({
      text: layout.memberCountText,
      size: 17 * fontScale,
      gapBefore: 15 * fontScale,
      bold: true,
      color: hexToRgba(layout.accentColor, 1),
    });
  }

  if (layout.dateText) {
    lines.push({
      text: layout.dateText,
      size: 14 * fontScale,
      gapBefore: 11 * fontScale,
      bold: false,
      color: "rgba(255, 255, 255, 0.5)",
    });
  }

  let blockHeight = 0;
  for (const line of lines) {
    blockHeight += line.gapBefore + line.size;
  }

  ctx.textAlign = "left";
  let cursorY = avatarCy - blockHeight / 2 + lines[0].size;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0) cursorY += line.gapBefore;

    applyTextEffect(ctx, line.effect, glowColor);
    ctx.font = resolveFont(line.size, layout.fontFamily, line.bold);
    ctx.fillStyle = line.color;
    ctx.fillText(truncateTextToWidth(ctx, line.text, textMaxWidth), textX, cursorY);

    if (i < lines.length - 1) cursorY += lines[i + 1].size;
  }

  applyTextEffect(ctx, "none", glowColor);
  ctx.restore();

  if (layout.borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, layout.borderColors, CORNER_RADIUS);
  }
}
