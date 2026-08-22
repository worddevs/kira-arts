import type { SKRSContext2D } from "@napi-rs/canvas";

import {
  drawCoverImage,
  drawGradientBorder,
  hexToRgba,
  loadImageSafe,
} from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateTextToWidth, truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import {
  CORNER_RADIUS,
  PADDING,
  HOST_AVATAR_SIZE,
  WINNER_AVATAR_SIZE,
  MAX_WINNERS_SHOWN,
  DEFAULT_ACCENT,
  ACTIVE_STATUS_COLOR,
  ENDED_STATUS_COLOR,
} from "./constants";
import { drawGiftIcon, drawTrophyIcon, drawConfetti, drawStatusPill, drawStarIcon, drawClockIcon } from "./decorations";
import type { GiveawayLayout } from "../../@Types/index";

async function drawAvatarCircle(
  ctx: SKRSContext2D,
  cx: number,
  cy: number,
  size: number,
  url: string | undefined,
  ringColor: string,
): Promise<void> {
  const radius = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
  ctx.fillStyle = "#0c0d11";
  ctx.fill();
  ctx.strokeStyle = hexToRgba(ringColor, 0.85);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const avatarImage = await loadImageSafe(url);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (avatarImage) {
    ctx.drawImage(avatarImage, cx - radius, cy - radius, size, size);
  } else {
    ctx.fillStyle = "#2b2d33";
    ctx.fillRect(cx - radius, cy - radius, size, size);
  }

  ctx.restore();
}

export async function drawGiveawayCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: GiveawayLayout,
): Promise<void> {
  const accentColor = layout.accentColor ? parseHex(layout.accentColor) : DEFAULT_ACCENT;
  const statusColor = layout.status === "ended" ? ENDED_STATUS_COLOR : ACTIVE_STATUS_COLOR;
  const winners = layout.winners ?? [];
  const hasWinners = winners.length > 0;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#0e0b12";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = await loadImageSafe(layout.customBackground);

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(8, 6, 12, 0.6)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createRadialGradient(
      width * 0.5,
      height * 0.05,
      10,
      width * 0.5,
      height * 0.5,
      width * 0.75,
    );
    grd.addColorStop(0, hexToRgba(accentColor, 0.35));
    grd.addColorStop(1, "rgba(10, 8, 14, 1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  drawConfetti(
    ctx,
    width,
    height,
    layout.borderColors.length ? layout.borderColors : [accentColor],
  );

  let cursorY = PADDING;

  drawGiftIcon(ctx, PADDING + 12, cursorY + 12, 26, accentColor);

  ctx.font = withFallback("bold 15px Helvetica Bold");
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("SORTEO", PADDING + 32, cursorY + 12);

  drawStatusPill(ctx, width - PADDING, cursorY, layout.status !== "ended", statusColor);

  cursorY += 56;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = withFallback("bold 34px Helvetica Bold");

  const prizeStarSize = 26;
  const prizeIconGap = 12;
  const prizeMaxTextWidth = width - PADDING * 2 - prizeStarSize - prizeIconGap;
  const prizeText = truncateTextToWidth(ctx, layout.prize, prizeMaxTextWidth);
  const prizeTextWidth = ctx.measureText(prizeText).width;
  const prizeBlockWidth = prizeStarSize + prizeIconGap + prizeTextWidth;
  const prizeStartX = width / 2 - prizeBlockWidth / 2;

  drawStarIcon(ctx, prizeStartX + prizeStarSize / 2, cursorY - 12, prizeStarSize, accentColor);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = layout.prizeColor ? parseHex(layout.prizeColor) : "#FFFFFF";
  ctx.fillText(prizeText, prizeStartX + prizeStarSize + prizeIconGap, cursorY);
  ctx.restore();

  ctx.textAlign = "center";

  cursorY += 36;

  if (layout.description) {
    ctx.font = withFallback("16px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    ctx.fillText(truncateText(layout.description, 70), width / 2, cursorY);
    cursorY += 34;
  } else {
    cursorY += 8;
  }

  const trophySize = 20;
  const avatarGap = 12;
  const midGap = 26;
  const trophyGap = 12;
  const maxRowWidth = width - PADDING * 2;

  const winnersLabel = `${layout.winnersCount} ${layout.winnersCount === 1 ? "ganador" : "ganadores"}`;
  ctx.font = withFallback("15px Helvetica");
  const winnersLabelWidth = ctx.measureText(winnersLabel).width;

  const fixedWidth = HOST_AVATAR_SIZE + avatarGap + midGap + trophySize + trophyGap + winnersLabelWidth;
  const hostMaxWidth = layout.hostName
    ? Math.max(60, maxRowWidth - fixedWidth)
    : 0;

  ctx.font = withFallback("15px Helvetica");
  const hostText = layout.hostName
    ? truncateTextToWidth(ctx, `Organiza ${layout.hostName}`, hostMaxWidth)
    : "";
  const hostTextWidth = layout.hostName ? ctx.measureText(hostText).width : 0;

  const rowWidth = layout.hostName
    ? HOST_AVATAR_SIZE + avatarGap + hostTextWidth + midGap + trophySize + trophyGap + winnersLabelWidth
    : trophySize + trophyGap + winnersLabelWidth;

  let rowX = width / 2 - rowWidth / 2;

  if (layout.hostName) {
    const avatarCx = rowX + HOST_AVATAR_SIZE / 2;

    await drawAvatarCircle(ctx, avatarCx, cursorY, HOST_AVATAR_SIZE, layout.hostAvatarUrl, accentColor);

    ctx.font = withFallback("15px Helvetica");
    ctx.fillStyle = layout.hostColor ? parseHex(layout.hostColor) : "rgba(255, 255, 255, 0.85)";
    ctx.textAlign = "left";
    ctx.fillText(hostText, rowX + HOST_AVATAR_SIZE + avatarGap, cursorY + 5);
    ctx.textAlign = "center";

    rowX += HOST_AVATAR_SIZE + avatarGap + hostTextWidth + midGap;
  }

  drawTrophyIcon(ctx, rowX + trophySize / 2, cursorY - 5, trophySize, accentColor);
  ctx.font = withFallback("15px Helvetica");
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.textAlign = "left";
  ctx.fillText(winnersLabel, rowX + trophySize + trophyGap, cursorY + 5);
  ctx.textAlign = "center";

  cursorY += 34;

  if (layout.dateText) {
    const clockSize = 13;
    const clockGap = 6;
    const infoColor = "rgba(255, 255, 255, 0.5)";

    ctx.font = withFallback("13px Helvetica");
    const dateTextWidth = ctx.measureText(layout.dateText).width;

    const participantsText =
      layout.participantsCount !== undefined
        ? `${layout.participantsCount} ${layout.participantsCount === 1 ? "participante" : "participantes"}`
        : undefined;
    const separator = "  •  ";
    const separatorWidth = participantsText ? ctx.measureText(separator).width : 0;
    const participantsTextWidth = participantsText ? ctx.measureText(participantsText).width : 0;

    const infoRowWidth =
      clockSize +
      clockGap +
      dateTextWidth +
      (participantsText ? separatorWidth + participantsTextWidth : 0);
    let infoX = width / 2 - infoRowWidth / 2;

    drawClockIcon(ctx, infoX + clockSize / 2, cursorY - 4, clockSize, infoColor);
    infoX += clockSize + clockGap;

    ctx.fillStyle = infoColor;
    ctx.textAlign = "left";
    ctx.fillText(layout.dateText, infoX, cursorY);
    infoX += dateTextWidth;

    if (participantsText) {
      ctx.fillText(separator, infoX, cursorY);
      infoX += separatorWidth;
      ctx.fillText(participantsText, infoX, cursorY);
    }

    ctx.textAlign = "center";
  }

  if (hasWinners) {
    const shown = winners.slice(0, MAX_WINNERS_SHOWN);
    const remaining = winners.length - shown.length;
    const slotWidth = 92;
    const rowWidth = shown.length * slotWidth;
    const startX = width / 2 - rowWidth / 2 + slotWidth / 2;
    const avatarY = height - PADDING - 40;

    for (let i = 0; i < shown.length; i++) {
      const winner = shown[i];
      const cx = startX + i * slotWidth;

      await drawAvatarCircle(ctx, cx, avatarY, WINNER_AVATAR_SIZE, winner.avatarUrl, accentColor);

      ctx.font = withFallback("12px Helvetica Bold");
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillText(truncateText(winner.username, 12), cx, avatarY + WINNER_AVATAR_SIZE / 2 + 18);
    }

    if (remaining > 0) {
      ctx.font = withFallback("13px Helvetica");
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.fillText(`+${remaining} más`, width / 2, height - PADDING + 4);
    }
  }

  ctx.restore();

  if (layout.borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, layout.borderColors, CORNER_RADIUS);
  }
}
