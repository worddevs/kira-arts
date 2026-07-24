import type { SKRSContext2D } from "@napi-rs/canvas";

import {
  drawCoverImage,
  drawGradientBorder,
  hexToRgba,
  loadImageSafe,
} from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateTextToWidth, formatDuration } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { drawSourceIcon } from "./icons";
import type { NowPlayingLayout } from "../../@Types/index";
import { CORNER_RADIUS, ARTWORK_SIZE, ARTWORK_RADIUS, MARGIN } from "./constants";

function drawPill(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
): void {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [height / 2]);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws a partial record disc peeking out from behind the artwork square
 * (classic "album sliding out of its sleeve" look). Must be called BEFORE
 * the artwork square itself so the square's own fill covers the overlapping
 * part, leaving only the crescent that extends past its edge visible.
 */
function drawVinylPeek(
  ctx: SKRSContext2D,
  artworkX: number,
  artworkY: number,
  size: number,
  accentColor: string,
): void {
  const cx = artworkX + size * 0.86;
  const cy = artworkY + size * 0.86;
  const r = size * 0.56;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#111318";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const grooves = 5;
  for (let i = 1; i <= grooves; i++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + (i % 2) * 0.03})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, (r * i) / (grooves + 1.3), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = hexToRgba(accentColor, 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0b0c10";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

async function drawArtwork(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  size: number,
  accentColor: string,
  artworkUrl?: string,
  paused?: boolean,
): Promise<void> {
  const artwork = await loadImageSafe(artworkUrl);

  ctx.save();
  ctx.shadowColor = hexToRgba(accentColor, 0.4);
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, [ARTWORK_RADIUS]);
  ctx.fillStyle = "#15171c";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, [ARTWORK_RADIUS]);
  ctx.clip();

  if (artwork) {
    // Square-ish covers (Spotify/Apple Music/local files) fill the slot
    // edge-to-edge with a plain cover-fit crop. Wide/tall sources — most
    // commonly 16:9 YouTube video thumbnails used as "artwork" — get
    // letterboxed instead: a blurred cover-fit copy fills the background so
    // there's no empty space, and the full, uncropped thumbnail sits on top.
    // Cropping a 16:9 frame to a square routinely cuts off text/logos along
    // the edges, which is what was happening before.
    const ratio = artwork.width / artwork.height;
    const isNearlySquare = ratio > 0.85 && ratio < 1.18;

    if (isNearlySquare) {
      drawCoverImage(ctx, artwork, x, y, size, size);
    } else {
      ctx.save();
      ctx.filter = "blur(14px) brightness(55%)";
      drawCoverImage(ctx, artwork, x - 6, y - 6, size + 12, size + 12);
      ctx.filter = "none";
      ctx.restore();

      const containScale = Math.min(size / artwork.width, size / artwork.height);
      const drawW = artwork.width * containScale;
      const drawH = artwork.height * containScale;
      ctx.drawImage(artwork, x + (size - drawW) / 2, y + (size - drawH) / 2, drawW, drawH);
    }
  } else {
    const grd = ctx.createLinearGradient(x, y, x + size, y + size);
    grd.addColorStop(0, hexToRgba(accentColor, 0.55));
    grd.addColorStop(1, "rgba(10, 10, 14, 0.9)");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, size, size);
  }

  if (paused) {
    ctx.fillStyle = "rgba(8, 9, 13, 0.55)";
    ctx.fillRect(x, y, size, size);

    const barWidth = size * 0.09;
    const barHeight = size * 0.32;
    const gap = size * 0.08;
    const cy = y + size / 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.beginPath();
    ctx.roundRect(x + size / 2 - gap / 2 - barWidth, cy - barHeight / 2, barWidth, barHeight, [
      barWidth / 4,
    ]);
    ctx.roundRect(x + size / 2 + gap / 2, cy - barHeight / 2, barWidth, barHeight, [barWidth / 4]);
    ctx.fill();
  }

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 0.75, y + 0.75, size - 1.5, size - 1.5, [ARTWORK_RADIUS]);
  ctx.stroke();
  ctx.restore();
}

export async function drawNowPlayingCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: NowPlayingLayout,
): Promise<void> {
  const accentColor = parseHex(layout.accentColor);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#0b0c10";
  ctx.fillRect(0, 0, width, height);

  const backgroundUrl = layout.customBackground ?? layout.artworkUrl;
  const backgroundImage = await loadImageSafe(backgroundUrl);

  if (backgroundImage) {
    ctx.save();
    ctx.filter = "blur(28px) brightness(45%)";
    drawCoverImage(ctx, backgroundImage, -20, -20, width + 40, height + 40);
    ctx.filter = "none";
    ctx.restore();

    ctx.fillStyle = "rgba(6, 7, 10, 0.55)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createRadialGradient(
      width * 0.2,
      height * 0.5,
      0,
      width * 0.2,
      height * 0.5,
      width * 0.75,
    );
    grd.addColorStop(0, hexToRgba(accentColor, 0.35));
    grd.addColorStop(1, "rgba(9, 10, 14, 1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  const artworkX = MARGIN;
  const artworkY = MARGIN;

  drawVinylPeek(ctx, artworkX, artworkY, ARTWORK_SIZE, accentColor);

  await drawArtwork(
    ctx,
    artworkX,
    artworkY,
    ARTWORK_SIZE,
    accentColor,
    layout.artworkUrl,
    layout.paused,
  );

  if (layout.isLive) {
    ctx.save();
    ctx.font = withFallback("bold 12px Helvetica Bold");
    const liveText = "LIVE";
    const liveTextWidth = ctx.measureText(liveText).width;
    const livePillWidth = liveTextWidth + 26;
    drawPill(ctx, artworkX + 10, artworkY + 10, livePillWidth, 22, "rgba(220, 38, 38, 0.92)");

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(artworkX + 10 + 12, artworkY + 10 + 11, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.textBaseline = "middle";
    ctx.fillText(liveText, artworkX + 10 + 20, artworkY + 10 + 12);
    ctx.restore();
  }

  const infoX = artworkX + ARTWORK_SIZE + 30;
  const contentWidth = width - infoX - MARGIN;

  let cursorY = artworkY;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  if (layout.sourceLabel && layout.showSourceBadge) {
    ctx.font = withFallback("bold 12px Helvetica Bold");
    const sourceText = layout.sourceLabel.toUpperCase();
    const sourceTextWidth = ctx.measureText(sourceText).width;
    const iconSize = 13;
    const iconGap = 6;
    const badgeWidth = iconSize + iconGap + sourceTextWidth + 24;

    drawPill(ctx, infoX, cursorY, badgeWidth, 22, hexToRgba(accentColor, 0.25));
    ctx.save();
    ctx.strokeStyle = hexToRgba(accentColor, 0.8);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(infoX, cursorY, badgeWidth, 22, [11]);
    ctx.stroke();
    ctx.restore();

    drawSourceIcon(
      ctx,
      layout.sourceIcon ?? "note",
      infoX + 11 + iconSize / 2,
      cursorY + 11,
      iconSize,
      "#ffffff",
    );

    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(sourceText, infoX + 11 + iconSize + iconGap, cursorY + 12);
    ctx.textBaseline = "top";

    cursorY += 22 + 14;
  } else {
    cursorY += 4;
  }

  ctx.font = withFallback("bold 32px Helvetica Bold");
  const displayTitle = truncateTextToWidth(ctx, layout.title, contentWidth);

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText(displayTitle, infoX + 1, cursorY + 1);
  ctx.fillStyle = layout.titleColor ? parseHex(layout.titleColor) : "#ffffff";
  ctx.fillText(displayTitle, infoX, cursorY);
  ctx.restore();

  cursorY += 44;

  if (layout.author) {
    ctx.font = withFallback("22px Helvetica");
    const displayAuthor = truncateTextToWidth(ctx, layout.author, contentWidth);

    ctx.save();
    ctx.fillStyle = layout.authorColor ? parseHex(layout.authorColor) : "rgba(255, 255, 255, 0.75)";
    ctx.fillText(displayAuthor, infoX, cursorY);
    ctx.restore();
  }

  const barX = infoX;
  const barWidth = contentWidth;
  const barHeight = 8;
  const barY = height - MARGIN - 34;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, barHeight, [barHeight / 2]);
  ctx.fill();

  const duration = layout.duration ?? 0;
  const progress = layout.isLive || duration <= 0 ? 1 : Math.min(1, layout.position / duration);
  const filledWidth = Math.max(barHeight, barWidth * progress);

  if (progress > 0) {
    const barGrd = ctx.createLinearGradient(barX, 0, barX + filledWidth, 0);
    for (let i = 0; i < layout.barColors.length; i++) {
      const stop = layout.barColors.length === 1 ? 0 : i / (layout.barColors.length - 1);
      barGrd.addColorStop(stop, layout.barColors[i]);
    }

    ctx.shadowColor = hexToRgba(layout.barColors[layout.barColors.length - 1], 0.7);
    ctx.shadowBlur = 10;
    ctx.fillStyle = barGrd;
    ctx.beginPath();
    ctx.roundRect(barX, barY, filledWidth, barHeight, [barHeight / 2]);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!layout.isLive) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(barX + filledWidth, barY + barHeight / 2, barHeight / 2 + 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.font = withFallback("13px Helvetica");
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.textAlign = "left";
  ctx.fillText(formatDuration(layout.position), barX, barY + barHeight + 8);
  ctx.textAlign = "right";
  ctx.fillText(
    layout.isLive ? "LIVE" : formatDuration(layout.duration),
    barX + barWidth,
    barY + barHeight + 8,
  );
  ctx.restore();

  if (layout.requester) {
    const pillHeight = 30;
    const avatarSize = pillHeight - 6;
    ctx.font = withFallback("13px Helvetica Bold");
    const requestedText = `Requested by ${layout.requester.username}`;
    const textWidth = ctx.measureText(requestedText).width;
    const pillWidth = avatarSize + 10 + textWidth + 24;
    const pillX = width - MARGIN - pillWidth;
    const pillY = MARGIN;

    drawPill(ctx, pillX, pillY, pillWidth, pillHeight, "rgba(10, 10, 14, 0.55)");

    const avatarImage = await loadImageSafe(layout.requester.avatarUrl);
    if (avatarImage) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pillX + 12 + avatarSize / 2, pillY + pillHeight / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImage, pillX + 12, pillY + 3, avatarSize, avatarSize);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(requestedText, pillX + 12 + avatarSize + 10, pillY + pillHeight / 2 + 1);
    ctx.restore();
  }

  ctx.restore();

  if (layout.borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, layout.borderColors, CORNER_RADIUS);
  }
}
