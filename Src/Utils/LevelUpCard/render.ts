import type { SKRSContext2D } from "@napi-rs/canvas";

import {
  drawCoverImage,
  drawGradientBorder,
  hexToRgba,
  loadImageSafe,
} from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateText, abbreviateNumber } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { drawBadgesPill } from "../MemberEeventCard/pills";
import { drawSparkles } from "../ShipCard/decorations";
import type { LevelUpLayout } from "./constants";
import { CORNER_RADIUS, AVATAR_SIZE, AVATAR_BORDER } from "./constants";

export async function drawLevelUpCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: LevelUpLayout,
): Promise<void> {
  const accentColor = parseHex(layout.accentColor);
  const avatarBorderColor = layout.avatarBorderColor
    ? parseHex(layout.avatarBorderColor)
    : accentColor;
  const kickerColor = layout.kickerColor ? parseHex(layout.kickerColor) : "#FFFFFF";
  const levelColor = layout.levelColor ? parseHex(layout.levelColor) : "#FFFFFF";
  const usernameColor = layout.usernameColor ? parseHex(layout.usernameColor) : "#FFFFFF";
  const xpColor = layout.xpColor ? parseHex(layout.xpColor) : "rgba(255, 255, 255, 0.75)";
  const barBackgroundColor = layout.barBackgroundColor
    ? parseHex(layout.barBackgroundColor)
    : "rgba(0, 0, 0, 0.35)";
  const backgroundTint = layout.backgroundTint !== false;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#0c0d11";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = await loadImageSafe(layout.customBackground);

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(8, 9, 13, 0.6)";
    ctx.fillRect(0, 0, width, height);

    if (backgroundTint) {
      const duotone = ctx.createLinearGradient(0, 0, width, height);

      duotone.addColorStop(0, hexToRgba(accentColor, 0.35));
      duotone.addColorStop(1, "rgba(8, 9, 13, 0.45)");

      ctx.fillStyle = duotone;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (backgroundTint) {
    const grd = ctx.createLinearGradient(0, 0, width, height);

    grd.addColorStop(0, hexToRgba(accentColor, 0.38));
    grd.addColorStop(0.55, "rgba(18, 15, 24, 1)");
    grd.addColorStop(1, "rgba(10, 11, 15, 1)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    const bgGlow = ctx.createRadialGradient(
      width * 0.18,
      height / 2,
      10,
      width * 0.18,
      height / 2,
      width * 0.45,
    );

    bgGlow.addColorStop(0, hexToRgba(accentColor, 0.4));
    bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);

    grd.addColorStop(0, "rgba(30, 30, 34, 1)");
    grd.addColorStop(1, "rgba(10, 11, 15, 1)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  drawSparkles(ctx, width, height, accentColor);

  if (layout.badges?.length) {
    await drawBadgesPill(ctx, width, layout.badges, layout.maxBadges ?? 3, 30, 46);
  }

  const hasMessage = Boolean(layout.message);
  const hasBar = layout.currentXp != null && layout.requiredXp != null && layout.requiredXp > 0;

  const avatarCx = 104;
  const avatarCy = height / 2;
  const outerRadius = AVATAR_SIZE / 2 + AVATAR_BORDER;

  if (backgroundTint) {
    const avatarGlow = ctx.createRadialGradient(
      avatarCx,
      avatarCy,
      outerRadius * 0.6,
      avatarCx,
      avatarCy,
      outerRadius * 1.8,
    );
    avatarGlow.addColorStop(0, hexToRgba(avatarBorderColor, 0.35));
    avatarGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = avatarGlow;
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, outerRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#111318";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, outerRadius - AVATAR_BORDER / 2, 0, Math.PI * 2);
  ctx.strokeStyle = avatarBorderColor;
  ctx.lineWidth = AVATAR_BORDER;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#292b2f";
  ctx.fill();

  const avatarImage = await loadImageSafe(layout.avatarUrl);

  if (avatarImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, AVATAR_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      avatarImage,
      avatarCx - AVATAR_SIZE / 2,
      avatarCy - AVATAR_SIZE / 2,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );
    ctx.restore();
  }

  const avatarFrameImage = await loadImageSafe(layout.avatarFrameUrl ?? undefined);

  if (avatarFrameImage) {
    const frameSize = AVATAR_SIZE * 1.2;

    ctx.drawImage(
      avatarFrameImage,
      avatarCx - frameSize / 2,
      avatarCy - frameSize / 2,
      frameSize,
      frameSize,
    );
  }

  const contentX = 196;
  const contentWidth = width - contentX - 40;

  type Row = {
    kind: "kicker" | "username" | "pill" | "message" | "bar";
    height: number;
    gapBefore: number;
  };

  const rows: Row[] = [
    { kind: "kicker", height: 16, gapBefore: 0 },
    { kind: "username", height: 38, gapBefore: 10 },
    { kind: "pill", height: 30, gapBefore: 10 },
  ];

  if (hasMessage) rows.push({ kind: "message", height: 18, gapBefore: 14 });
  if (hasBar) rows.push({ kind: "bar", height: 16, gapBefore: hasMessage ? 20 : 24 });

  const totalHeight = rows.reduce((sum, row) => sum + row.gapBefore + row.height, 0);

  let rowTop = avatarCy - totalHeight / 2;

  ctx.textAlign = "left";

  for (const row of rows) {
    rowTop += row.gapBefore;
    const centerY = rowTop + row.height / 2;

    if (row.kind === "kicker") {
      ctx.font = withFallback("bold 14px Helvetica Bold");
      ctx.fillStyle = hexToRgba(kickerColor, 1);
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillText("LEVELED UP", contentX, centerY);
      ctx.restore();
    } else if (row.kind === "username") {
      ctx.font = withFallback("bold 34px Helvetica Bold");
      ctx.fillStyle = usernameColor;
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillText(truncateText(layout.username, 22), contentX, centerY, contentWidth);
      ctx.restore();
    } else if (row.kind === "pill") {
      const levelPillText = `LEVEL ${layout.level}`;
      ctx.font = withFallback("bold 16px Helvetica Bold");
      const levelPillTextWidth = ctx.measureText(levelPillText).width;
      const levelPillPaddingX = 16;
      const levelPillWidth = levelPillTextWidth + levelPillPaddingX * 2;

      const pillFill = ctx.createLinearGradient(contentX, rowTop, contentX, rowTop + row.height);
      pillFill.addColorStop(0, hexToRgba(levelColor, 0.24));
      pillFill.addColorStop(1, hexToRgba(levelColor, 0.12));
      ctx.fillStyle = pillFill;
      ctx.beginPath();
      ctx.roundRect(contentX, rowTop, levelPillWidth, row.height, [row.height / 2]);
      ctx.fill();

      ctx.strokeStyle = hexToRgba(levelColor, 0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(contentX, rowTop, levelPillWidth, row.height, [row.height / 2]);
      ctx.stroke();

      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillStyle = levelColor;
      ctx.fillText(levelPillText, contentX + levelPillPaddingX, centerY);
      ctx.restore();
    } else if (row.kind === "message") {
      ctx.font = withFallback("15px Helvetica");
      ctx.fillStyle = layout.messageColor
        ? parseHex(layout.messageColor)
        : "rgba(255, 255, 255, 0.65)";
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillText(truncateText(layout.message!, 58), contentX, centerY, contentWidth);
      ctx.restore();
    } else if (row.kind === "bar") {
      const barX = contentX;
      const barWidth = contentWidth;
      const barHeight = row.height;

      ctx.font = withFallback("bold 12px Helvetica");
      ctx.textAlign = "right";
      ctx.fillStyle = xpColor;
      ctx.fillText(
        `${abbreviateNumber(layout.currentXp!)} / ${abbreviateNumber(layout.requiredXp!)} XP`,
        barX + barWidth,
        rowTop - 8,
      );
      ctx.textAlign = "left";

      ctx.fillStyle = barBackgroundColor;
      ctx.beginPath();
      ctx.roundRect(barX, rowTop, barWidth, barHeight, [barHeight / 2]);
      ctx.fill();

      const progress = Math.min(1, Math.max(0, layout.currentXp! / layout.requiredXp!));
      const minVisibleWidth = Math.min(barWidth, barHeight * 1.5);
      const filledWidth =
        progress > 0 ? Math.max(minVisibleWidth, Math.round(barWidth * progress)) : 0;

      if (filledWidth > 0) {
        const barGrd = ctx.createLinearGradient(barX, 0, barX + filledWidth, 0);
        for (let i = 0; i < layout.barColors.length; i++) {
          const stop = layout.barColors.length === 1 ? 0 : i / (layout.barColors.length - 1);
          barGrd.addColorStop(stop, layout.barColors[i]);
        }

        ctx.save();
        ctx.shadowColor = hexToRgba(layout.barColors[layout.barColors.length - 1], 0.85);
        ctx.shadowBlur = 12;
        ctx.fillStyle = barGrd;
        ctx.beginPath();
        ctx.roundRect(barX, rowTop, filledWidth, barHeight, [barHeight / 2]);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.roundRect(barX + 3, rowTop + 2, Math.max(0, filledWidth - 6), barHeight * 0.32, [
          barHeight / 2,
        ]);
        ctx.fill();
        ctx.restore();
      }
    }

    rowTop += row.height;
  }

  ctx.restore();

  if (layout.borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, layout.borderColors, CORNER_RADIUS);
  }
}
