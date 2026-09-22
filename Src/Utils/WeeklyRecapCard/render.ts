import type { SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";

import { drawCoverImage, drawGradientBorder, hexToRgba } from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { CORNER_RADIUS, AVATAR_SIZE, AVATAR_BORDER, PADDING, DEFAULT_ACCENT } from "./constants";
import { drawRecapAvatar } from "./avatar";
import {
  drawMessageIcon,
  drawVoiceIcon,
  drawBoltIcon,
  drawFlameIcon,
  drawStatTile,
  drawBarChart,
  drawTrendBadge,
} from "./decorations";
import type { WeeklyRecapLayout } from "../../@Types/index";

function formatVoiceMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

export async function drawWeeklyRecapCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: WeeklyRecapLayout,
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

  ctx.fillStyle = "#0b0c12";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = layout.customBackground
    ? await loadImage(layout.customBackground).catch(() => undefined)
    : undefined;

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(9, 10, 15, 0.72)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, hexToRgba(accentColor, 0.28));
    grd.addColorStop(0.5, "#111219");
    grd.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.85, 30, 10, width * 0.85, 30, width * 0.5);
    glow.addColorStop(0, hexToRgba(accentColor, 0.28));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  const avatarCx = PADDING + AVATAR_SIZE / 2;
  const avatarCy = PADDING + AVATAR_SIZE / 2;

  await drawRecapAvatar(
    ctx,
    avatarCx,
    avatarCy,
    AVATAR_SIZE,
    AVATAR_BORDER,
    layout.avatarUrl,
    accentColor,
  );

  const textX = PADDING + AVATAR_SIZE + 20;

  ctx.textAlign = "left";
  ctx.font = withFallback("bold 12px Helvetica Bold");
  ctx.fillStyle = hexToRgba(accentColor, 1);
  ctx.fillText("WEEKLY RECAP", textX, PADDING + 14);

  ctx.font = withFallback("24px Anton");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(truncateText(layout.username, 26), textX, PADDING + 42);

  if (layout.guildName) {
    ctx.font = withFallback("13px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fillText(truncateText(layout.guildName, 34), textX, PADDING + 62);
  }

  if (typeof layout.rankChange === "number") {
    ctx.font = withFallback("bold 12px Helvetica Bold");
    const badgeText = `${layout.rankChange >= 0 ? "▲" : "▼"} ${Math.abs(layout.rankChange)}`;
    const badgeWidth = ctx.measureText(badgeText).width + 24;
    drawTrendBadge(ctx, width - PADDING - badgeWidth, PADDING, layout.rankChange);
  }

  const chartX = PADDING;
  const chartY = PADDING + AVATAR_SIZE + 30;
  const chartWidth = width - PADDING * 2;
  const chartHeight = 108;

  drawBarChart(ctx, chartX, chartY, chartWidth, chartHeight, layout.dailyActivity, accentColor);

  if (layout.mostActiveDay) {
    ctx.textAlign = "right";
    ctx.font = withFallback("12px Helvetica");
    ctx.fillStyle = hexToRgba(accentColor, 0.9);
    ctx.fillText(`Peak day: ${layout.mostActiveDay}`, width - PADDING, chartY - 12);
  }

  const tileGap = 16;
  const tileWidth = (chartWidth - tileGap) / 2;
  const tileHeight = 60;
  const statsY = chartY + chartHeight + 46;

  const stats: Array<{
    icon: typeof drawMessageIcon;
    label: string;
    value: string | undefined;
  }> = [
    {
      icon: drawMessageIcon,
      label: "Messages",
      value: typeof layout.messagesSent === "number" ? `${layout.messagesSent}` : undefined,
    },
    {
      icon: drawVoiceIcon,
      label: "Voice time",
      value:
        typeof layout.voiceMinutes === "number"
          ? formatVoiceMinutes(layout.voiceMinutes)
          : undefined,
    },
    {
      icon: drawBoltIcon,
      label: "XP gained",
      value: typeof layout.xpGained === "number" ? `${layout.xpGained}` : undefined,
    },
    {
      icon: drawFlameIcon,
      label: "Streak",
      value:
        typeof layout.currentStreak === "number"
          ? `${layout.currentStreak} ${layout.currentStreak === 1 ? "day" : "days"}`
          : undefined,
    },
  ];

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    if (!stat.value) continue;

    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = chartX + col * (tileWidth + tileGap);
    const y = statsY + row * (tileHeight + tileGap);

    drawStatTile(ctx, x, y, tileWidth, tileHeight, stat.icon, stat.label, stat.value, accentColor);
  }

  ctx.restore();

  if (borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, borderColors, CORNER_RADIUS - 2, 4);
  }
}
