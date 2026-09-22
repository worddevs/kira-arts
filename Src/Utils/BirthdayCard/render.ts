import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateTextToWidth } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { CORNER_RADIUS, AVATAR_SIZE, AVATAR_BORDER, PADDING, DEFAULT_ACCENT } from "./constants";
import { drawBirthdayAvatar } from "./avatar";
import {
  drawBalloonCluster,
  drawCakeIcon,
  drawConfettiBurst,
  drawSparkles,
  drawGlowRing,
  drawCornerTag,
  drawChip,
  measureChipWidth,
} from "./decorations";
import type { BirthdayLayout } from "../../@Types/index";

export async function drawBirthdayCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: BirthdayLayout,
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

  ctx.fillStyle = "#0d0710";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = layout.customBackground
    ? await loadImage(layout.customBackground).catch(() => undefined)
    : undefined;

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(10, 6, 12, 0.6)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, hexToRgba(accentColor, 0.4));
    grd.addColorStop(1, "#170b1a");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  drawGlowRing(ctx, PADDING + AVATAR_SIZE / 2, height / 2, width * 0.4, accentColor);
  drawConfettiBurst(ctx, width, height, accentColor);
  drawSparkles(ctx, width, height, accentColor);
  drawBalloonCluster(ctx, width - 34, height + 6, "right", 0.46);

  const avatarCx = PADDING + AVATAR_SIZE / 2 + AVATAR_BORDER;
  const avatarCy = height / 2;

  await drawBirthdayAvatar(
    ctx,
    avatarCx,
    avatarCy,
    AVATAR_SIZE,
    AVATAR_BORDER,
    layout.avatarUrl,
    accentColor,
  );
  drawCakeIcon(
    ctx,
    avatarCx + AVATAR_SIZE / 2 - 2,
    avatarCy + AVATAR_SIZE / 2 - 4,
    34,
    accentColor,
  );

  drawCornerTag(ctx, width - 20, 16, "🎉 BIRTHDAY", accentColor);

  const textX = avatarCx + AVATAR_SIZE / 2 + AVATAR_BORDER + 24;
  const textMaxWidth = width - textX - 20;
  const hasMessage = Boolean(layout.message);
  const hasPills = typeof layout.age === "number" || typeof layout.yearsInServer === "number";

  let blockHeight = 15 + 6 + 28;
  if (hasMessage) blockHeight += 10 + 17;
  if (hasPills) blockHeight += 12 + 30;

  let cursorY = avatarCy - blockHeight / 2 + 15;

  ctx.textAlign = "left";
  ctx.font = withFallback("bold 13px Helvetica Bold");
  ctx.fillStyle = hexToRgba(accentColor, 1);
  ctx.fillText("🎂 HAPPY BIRTHDAY", textX, cursorY);
  cursorY += 6 + 28;

  ctx.font = withFallback("28px Anton");
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  if (layout.username) {
    ctx.fillText(truncateTextToWidth(ctx, layout.username, textMaxWidth), textX, cursorY);
  }

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (hasMessage) {
    cursorY += 10 + 17;
    ctx.font = withFallback("15px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.fillText(truncateTextToWidth(ctx, layout.message!, textMaxWidth), textX, cursorY);
  }

  if (hasPills) {
    cursorY += 12 + 30;

    const chips: string[] = [];
    if (typeof layout.age === "number") chips.push(`🎂 Turns ${layout.age}`);
    if (typeof layout.yearsInServer === "number") {
      const unit = layout.yearsInServer === 1 ? "year" : "years";
      chips.push(`📅 ${layout.yearsInServer} ${unit} here`);
    }

    let chipX = textX;
    const chipY = cursorY - 21;

    for (const chip of chips) {
      const chipWidth = measureChipWidth(ctx, chip);
      if (chipX + chipWidth > width - 20) break;
      drawChip(ctx, chipX, chipY, chip, accentColor);
      chipX += chipWidth + 10;
    }
  }

  ctx.restore();

  if (borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, borderColors, CORNER_RADIUS - 2, 4);
  }
}
