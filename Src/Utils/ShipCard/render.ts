import type { SKRSContext2D } from "@napi-rs/canvas";

import {
  drawCoverImage,
  hexToRgba,
  drawGradientBorder,
  loadImageSafe,
} from "../canvasShared.utils";
import { parseHex } from "../validations.utils";
import { truncateText } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { CORNER_RADIUS, AVATAR_SIZE, HEART_WIDTH, HEART_HEIGHT, DEFAULT_ACCENT } from "./constants";
import type { ShipLayout } from "./canvasSetup";
import { drawHeartIcon, drawHeartMeter } from "./heartMeter";
import { drawAvatarCircle } from "./avatar";
import { drawSparkles, drawConnector, drawShipNamePill, drawVignette } from "./decorations";

export async function drawShipCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: ShipLayout,
): Promise<void> {
  const accentColor = layout.accentColor ? parseHex(layout.accentColor) : DEFAULT_ACCENT;
  const heartColor = layout.heartColor ? parseHex(layout.heartColor) : accentColor;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [CORNER_RADIUS]);
  ctx.clip();

  ctx.fillStyle = "#0c0d11";
  ctx.fillRect(0, 0, width, height);

  const backgroundImage = await loadImageSafe(layout.customBackground);

  if (backgroundImage) {
    drawCoverImage(ctx, backgroundImage, 0, 0, width, height);

    ctx.fillStyle = "rgba(8, 9, 13, 0.5)";
    ctx.fillRect(0, 0, width, height);

    const duotone = ctx.createLinearGradient(0, 0, width, height);
    duotone.addColorStop(0, hexToRgba(accentColor, 0.25));
    duotone.addColorStop(1, "rgba(8, 9, 13, 0.35)");
    ctx.fillStyle = duotone;
    ctx.fillRect(0, 0, width, height);
  } else {
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, hexToRgba(accentColor, 0.32));
    grd.addColorStop(0.55, "rgba(20, 16, 26, 1)");
    grd.addColorStop(1, "rgba(10, 11, 15, 1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width / 2,
      height * 0.62,
      10,
      width / 2,
      height * 0.62,
      width * 0.4,
    );
    glow.addColorStop(0, hexToRgba(accentColor, 0.35));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  drawVignette(ctx, width, height);
  drawSparkles(ctx, width, height, heartColor);

  const showText = layout.showText ?? true;

  if (showText) {
    const headerPanel = ctx.createLinearGradient(0, 0, 0, 96);
    headerPanel.addColorStop(0, "rgba(5, 5, 8, 0.55)");
    headerPanel.addColorStop(1, "rgba(5, 5, 8, 0)");
    ctx.fillStyle = headerPanel;
    ctx.fillRect(0, 0, width, 96);

    drawHeartIcon(ctx, 34, 32, 18, heartColor);

    ctx.textAlign = "left";
    ctx.font = withFallback("13px Helvetica");
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText(`LA COMPATIBILIDAD ES ${layout.percentage}%`.toUpperCase(), 54, 37);

    ctx.font = withFallback("24px Helvetica Bold");
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(truncateText(layout.message, 42), 32, 76);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    if (layout.shipName) {
      drawShipNamePill(ctx, width, layout.shipName, accentColor);
    }
  }

  const bandY = showText ? 110 : 20;
  const bandHeight = height - bandY - (showText ? 26 : 20);
  const bandCy = bandY + bandHeight / 2;
  const leftCx = 24 + AVATAR_SIZE / 2 + 24;
  const rightCx = width - 24 - AVATAR_SIZE / 2 - 24;

  const heartWidth = Math.min(
    HEART_WIDTH,
    rightCx - AVATAR_SIZE / 2 - (leftCx + AVATAR_SIZE / 2) - 20,
  );
  const heartHeight = Math.min(HEART_HEIGHT, bandHeight - 4);

  drawConnector(
    ctx,
    leftCx + AVATAR_SIZE / 2 + 10,
    width / 2 - heartWidth / 2 - 10,
    bandCy,
    heartColor,
  );
  drawConnector(
    ctx,
    width / 2 + heartWidth / 2 + 10,
    rightCx - AVATAR_SIZE / 2 - 10,
    bandCy,
    heartColor,
  );

  await drawAvatarCircle(ctx, leftCx, bandCy, layout.leftAvatarUrl, accentColor);
  await drawAvatarCircle(ctx, rightCx, bandCy, layout.rightAvatarUrl, accentColor);

  drawHeartMeter(ctx, width / 2, bandCy, heartWidth, heartHeight, layout.percentage, heartColor);

  ctx.restore();

  const borderColors = layout.noBorder
    ? []
    : layout.borderColors?.length
      ? layout.borderColors
      : [accentColor];

  if (borderColors.length > 0) {
    drawGradientBorder(ctx, width, height, borderColors, CORNER_RADIUS - 2, 4);
  }
}
