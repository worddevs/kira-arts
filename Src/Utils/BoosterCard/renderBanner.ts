import { type SKRSContext2D, loadImage } from "@napi-rs/canvas";

import {
  DEFAULT_BORDER_THICKNESS,
  drawCoverImage,
  drawGradientBorder,
  hexToRgba,
} from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateTextToWidth } from "../strings.utils";
import { resolveFont } from "../fonts.utils";
import { applyTextEffect } from "../MemberEeventCard/textEffects";
import { drawBadgesPill } from "../MemberEeventCard/pills";
import type { BannerLine, BoosterLayout, MemberEventDrawOverrides } from "../../@Types/index";
import {
  BANNER_AVATAR_BORDER,
  BANNER_AVATAR_SIZE,
  BANNER_PADDING,
  CARD_BACKGROUND,
  CORNER_RADIUS,
} from "./constants";
import { computeEffectiveFontScale } from "./dimensions";
import { drawSparkleField } from "./decorations";
import { drawBoosterAvatar } from "./avatar";
import { drawBoosterKindPill, drawBoosterServerTagPill } from "./pills";

export async function drawBannerBoosterCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  avatarUrl: string,
  username: string,
  layout: BoosterLayout,
  overrides?: MemberEventDrawOverrides,
): Promise<void> {
  const fontScale = computeEffectiveFontScale(layout);
  const padding = BANNER_PADDING * fontScale;
  const avatarSize = Math.round(BANNER_AVATAR_SIZE * fontScale);
  const avatarBorder = Math.max(3, Math.round(BANNER_AVATAR_BORDER * fontScale));
  const avatarBorderColor = layout.avatarBorderColor
    ? parseHex(layout.avatarBorderColor)
    : layout.accentColor;
  const showBoostIcon = layout.showBoostIcon !== false;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = CARD_BACKGROUND;
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

  if (showBoostIcon) {
    const textZoneX = padding + avatarSize + avatarBorder * 2 + 26 * fontScale;

    drawSparkleField(ctx, width, height, fontScale * 0.9, {
      x0: textZoneX - 10,
      y0: height * 0.25,
      x1: width,
      y1: height,
    });
  }

  let cornerPillY = 14;
  const cornerPillRightX = width - 14;

  if (layout.kindLabel) {
    const pillHeight = drawBoosterKindPill(
      ctx,
      cornerPillRightX,
      cornerPillY,
      layout.kindLabel,
      layout.accentColor,
      "right",
      true,
      showBoostIcon,
    );

    cornerPillY += pillHeight + 6;
  }

  if (layout.serverTag) {
    await drawBoosterServerTagPill(
      ctx,
      layout.serverTag,
      cornerPillRightX,
      cornerPillY,
      "right",
      true,
    );
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
  const avatarImage = overrides?.avatarImage ?? (await loadImage(avatarUrl).catch(() => undefined));

  await drawBoosterAvatar(ctx, {
    cx: avatarCx,
    cy: avatarCy,
    size: avatarSize,
    border: avatarBorder,
    borderColor: avatarBorderColor,
    accentColor: layout.accentColor,
    image: avatarImage,
    frameUrl: layout.avatarFrameUrl,
    showBoostIcon,
    boostMultiplier: layout.userBoostCount,
  });

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

  if (layout.boostText) {
    lines.push({
      text: layout.boostText,
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
    drawGradientBorder(
      ctx,
      width,
      height,
      layout.borderColors,
      CORNER_RADIUS,
      DEFAULT_BORDER_THICKNESS,
      layout.borderMix,
    );
  }
}
