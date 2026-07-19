import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { abbreviateNumber, truncateText } from "../strings.utils";
import { parseHex } from "../validations.utils";
import { resolveCardColors } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";
import type { LeaderboardOptions } from "../../@Types/index";
import type {
  ResolvedLeaderboardEntry} from "./constants";
import {
  CARD_WIDTH,
  ROW_HEIGHT,
  PADDING,
  RANK_COLORS,
  DEFAULT_ACCENT
} from "./constants";
import { hexToRgba } from "./colorUtils";

export async function drawRow(
  ctx: SKRSContext2D,
  resolved: ResolvedLeaderboardEntry,
  rowY: number,
  options: LeaderboardOptions,
): Promise<void> {
  const { entry, data } = resolved;
  const { basicInfo, assets } = data;

  const rowColor =
    RANK_COLORS[entry.rank] ??
    (options?.accentColor ? parseHex(options.accentColor) : DEFAULT_ACCENT);
  const rowWidth = CARD_WIDTH - PADDING * 2;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "rgba(18, 20, 26, 0.55)";
  ctx.beginPath();
  ctx.roundRect(PADDING, rowY, rowWidth, ROW_HEIGHT, [20]);
  ctx.fill();
  ctx.restore();

  const rowGradient = ctx.createLinearGradient(0, rowY, 0, rowY + ROW_HEIGHT);

  rowGradient.addColorStop(0, hexToRgba(rowColor, 0.14));
  rowGradient.addColorStop(1, hexToRgba(rowColor, 0.05));

  ctx.fillStyle = rowGradient;
  ctx.beginPath();
  ctx.roundRect(PADDING, rowY, rowWidth, ROW_HEIGHT, [20]);
  ctx.fill();

  ctx.strokeStyle = hexToRgba(rowColor, 0.45);
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.roundRect(PADDING + 0.75, rowY + 0.75, rowWidth - 1.5, ROW_HEIGHT - 1.5, [20]);
  ctx.stroke();

  const circleSize = 60;
  const circleY = rowY + (ROW_HEIGHT - circleSize) / 2;

  const rankX = PADDING + 22 + circleSize / 2;

  ctx.beginPath();
  ctx.arc(rankX, circleY + circleSize / 2, circleSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = entry.rank <= 3 ? rowColor : hexToRgba(rowColor, 0.16);
  ctx.fill();

  if (entry.rank > 3) {
    ctx.strokeStyle = hexToRgba(rowColor, 0.8);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rankX, circleY + circleSize / 2, circleSize / 2 - 1, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.font = withFallback("bold 24px Helvetica Bold");
  ctx.textAlign = "center";
  ctx.fillStyle = entry.rank <= 3 ? "#14151a" : "#f1f2f4";
  ctx.fillText(`${entry.rank}`, rankX, circleY + circleSize / 2 + 8);

  const avatarX = PADDING + 22 + circleSize + 20;
  const avatarUrl = assets.avatarURL ?? assets.defaultAvatarURL;
  const avatarCx = avatarX + circleSize / 2;
  const avatarCy = circleY + circleSize / 2;

  if (entry.rank === 1) {
    const glow = ctx.createRadialGradient(
      avatarCx,
      avatarCy,
      circleSize / 2,
      avatarCx,
      avatarCy,
      circleSize,
    );

    glow.addColorStop(0, hexToRgba(rowColor, 0.35));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, circleSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, circleSize / 2 + 3, 0, Math.PI * 2);
  ctx.strokeStyle = rowColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, circleSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#292b2f";
  ctx.fill();

  const avatarImage = await loadImage(avatarUrl).catch(() => undefined);

  if (avatarImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, circleSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImage, avatarX, circleY, circleSize, circleSize);
    ctx.restore();
  }

  const levelText = `Nv. ${abbreviateNumber(entry.level)}`;

  ctx.font = withFallback("bold 17px Helvetica Bold");

  const levelTextWidth = ctx.measureText(levelText).width;
  const pillPaddingX = 14;
  const pillWidth = levelTextWidth + pillPaddingX * 2;
  const pillHeight = 30;
  const pillX = CARD_WIDTH - PADDING - 16 - pillWidth;
  const pillY = rowY + 20;

  ctx.fillStyle = hexToRgba(rowColor, 0.16);
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.fill();

  ctx.strokeStyle = hexToRgba(rowColor, 0.7);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [pillHeight / 2]);
  ctx.stroke();

  ctx.font = withFallback("bold 17px Helvetica Bold");
  ctx.textAlign = "center";
  ctx.fillStyle = options?.levelColor ? parseHex(options.levelColor) : "#f1f2f4";
  ctx.fillText(levelText, pillX + pillWidth / 2, pillY + pillHeight / 2 + 6);

  const textX = avatarX + circleSize + 22;
  const displayName = truncateText(basicInfo.globalName || basicInfo.username, 22);
  const maxNameWidth = pillX - 16 - textX;

  ctx.font = withFallback("21px Helvetica Bold");
  ctx.textAlign = "left";
  ctx.fillStyle = options?.usernameColor ? parseHex(options.usernameColor) : "#FFFFFF";
  ctx.fillText(displayName, textX, rowY + 34, Math.max(maxNameWidth, 40));

  const barX = textX;
  const barWidth = CARD_WIDTH - PADDING - 16 - barX;
  const barY = rowY + 56;
  const barHeight = 16;

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, [barHeight / 2]);
  ctx.fill();

  const progress = entry.requiredXp > 0 ? Math.min(entry.currentXp / entry.requiredXp, 1) : 0;
  const minVisibleWidth = Math.min(barWidth, barHeight * 2.5);
  const filledWidth = progress > 0 ? Math.max(minVisibleWidth, Math.round(barWidth * progress)) : 0;

  const barColors = resolveCardColors({
    custom: options?.barColor,
    fallback: [rowColor, hexToRgba(rowColor, 0.6)],
  });

  const grd = ctx.createLinearGradient(barX, 0, barX + filledWidth, 0);

  for (let i = 0; i < barColors.length; i++) {
    const stop = barColors.length === 1 ? 0 : i / (barColors.length - 1);

    grd.addColorStop(stop, barColors[i].startsWith("rgba") ? barColors[i] : parseHex(barColors[i]));
  }

  if (progress > 0) {
    ctx.save();
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.roundRect(barX, barY, filledWidth, barHeight, [barHeight / 2]);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.roundRect(barX + 3, barY + 2, Math.max(0, filledWidth - 6), barHeight * 0.28, [
      barHeight / 2,
    ]);
    ctx.fill();
    ctx.restore();
  }

  ctx.font = withFallback("bold 13px Helvetica");
  ctx.textAlign = "right";
  ctx.fillStyle = hexToRgba("#f1f2f4", 0.85);
  ctx.fillText(
    `${abbreviateNumber(entry.currentXp)} / ${abbreviateNumber(entry.requiredXp)} XP`,
    barX + barWidth,
    barY + barHeight + 16,
  );
}
