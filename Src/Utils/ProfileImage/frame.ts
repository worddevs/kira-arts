import type { Canvas } from "@napi-rs/canvas";
import { createCanvas, loadImage } from "@napi-rs/canvas";

import { parseHex, parseImg } from "../validations.utils";
import { KiraError } from "../error.utils";
import type { ProfileOptions } from "../../@Types/index";
import { otherImgs, alphaValue } from "./constants";
import type { CanvasBadge } from "./badges";

export async function genBase(
  options: ProfileOptions,
  avatarData: string,
  bannerData: string | null,
): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  let isBannerLoaded = true;
  let cardBackground = await loadImage(
    options?.customBackground ? parseImg(options.customBackground) : (bannerData ?? avatarData),
  ).catch(() => undefined);

  if (!cardBackground) {
    cardBackground = await loadImage(avatarData).catch(() => undefined);
    isBannerLoaded = false;
  }

  const condAvatar = options?.customBackground
    ? true
    : !isBannerLoaded
      ? false
      : bannerData !== null;
  const wX = condAvatar ? 885 : 900;
  const wY = condAvatar ? 303 : wX;
  const cY = condAvatar ? 0 : -345;

  ctx.fillStyle = "#18191c";
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);
  ctx.fill();

  ctx.filter =
    (options?.moreBackgroundBlur
      ? "blur(9px)"
      : options?.disableBackgroundBlur
        ? "blur(0px)"
        : "blur(3px)") +
    (options?.backgroundBrightness ? ` brightness(${options.backgroundBrightness + 100}%)` : "");
  ctx.drawImage(cardBackground!, 0, cY, wX, wY);

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#2a2d33";
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);
  ctx.fill();

  return canvas;
}

export async function genFrame(badges: CanvasBadge[], options: ProfileOptions): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const cardFrame = await loadImage(Buffer.from(otherImgs.frame, "base64"));

  ctx.globalCompositeOperation = "source-out";
  ctx.globalAlpha = 0.5;
  ctx.drawImage(cardFrame, 0, 0, 885, 303);
  ctx.globalCompositeOperation = "source-over";

  ctx.globalAlpha = alphaValue;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(696, 248, 165, 33, [12]);
  ctx.fill();
  ctx.globalAlpha = 1;

  const badgesLength = badges.length;

  if (options?.badgesFrame && badgesLength > 0 && !options?.removeBadges) {
    ctx.fillStyle = "#000";
    ctx.globalAlpha = alphaValue;
    ctx.beginPath();
    ctx.roundRect(857 - badgesLength * 59, 15, 59 * badgesLength + 8, 61, [17]);
    ctx.fill();
  }

  return canvas;
}

export async function genBorder(borderColors: string[], options: ProfileOptions): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  if (borderColors.length > 20)
    throw new KiraError(
      `Invalid borderColor length (${borderColors.length}) must be a maximum of 20 colors`,
    );

  const gradX = options.borderAllign == "vertical" ? 0 : 885;
  const gradY = options.borderAllign == "vertical" ? 303 : 0;

  const grd = ctx.createLinearGradient(0, 0, gradX, gradY);

  for (let i = 0; i < borderColors.length; i++) {
    const stop = borderColors.length === 1 ? 0 : i / (borderColors.length - 1);
    grd.addColorStop(stop, parseHex(borderColors[i]));
  }

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);

  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();
  ctx.roundRect(9, 9, 867, 285, [25]);
  ctx.fill();

  return canvas;
}
