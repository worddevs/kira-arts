import { type Canvas, createCanvas, loadImage } from "@napi-rs/canvas";

import { KiraError } from "../error.utils";
import type { ProfileOptions, KiraUserData } from "../../@Types/index";
import { statusImgs } from "./constants";

export async function genNameplate(data: KiraUserData): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const nameplate = data?.decoration?.nameplate;
  if (!nameplate) return canvas;

  const image = await loadImage(nameplate.imageURL).catch(() => undefined);
  if (!image) return canvas;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(280, 20, 585, 260, [20]);
  ctx.clip();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(image, 280, 20, 585, 260);
  ctx.restore();

  return canvas;
}

export async function genAvatarFrame(data: KiraUserData, options: ProfileOptions): Promise<Canvas> {
  let canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const frameUrl = data?.decoration?.avatarFrame;

  const avatarFrame = await loadImage(frameUrl!);

  if (options?.squareAvatar) {
    // Discord's avatar decorations are drawn as circular assets slightly
    // larger than the avatar itself (269px vs 225px) so they overhang the
    // edges. When squareAvatar is on, clip that overhang to a rounded
    // square (radius scaled to the same proportion as the avatar's own
    // clip) so the frame reads as "square" too instead of a circle sitting
    // on top of a squared photo.
    const roundValue = 30 * (269 / 225);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(25, 18, 269, 269, [roundValue]);
    ctx.clip();
    ctx.drawImage(avatarFrame, 25, 18, 269, 269);
    ctx.restore();
  } else {
    ctx.drawImage(avatarFrame, 25, 18, 269, 269);
  }

  if (options?.presenceStatus) {
    canvas = await cutAvatarStatus(canvas, options);
  }

  return canvas;
}

export async function cutAvatarStatus(
  canvasToEdit: Canvas,
  options: ProfileOptions,
): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const cX = options.presenceStatus == "phone" ? 224.5 : 212;
  const cY = options.presenceStatus == "phone" ? 202 : 204;

  ctx.drawImage(canvasToEdit, 0, 0);

  ctx.globalCompositeOperation = "destination-out";

  if (options.presenceStatus == "phone") ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
  else ctx.roundRect(212, 204, 62, 62, [62]);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  return canvas;
}

export async function genStatus(canvasToEdit: Canvas, options: ProfileOptions): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const validStatus = ["idle", "dnd", "online", "invisible", "offline", "streaming", "phone"];

  if (!validStatus.includes(options.presenceStatus as string))
    throw new KiraError(
      `Invalid presenceStatus ('${options.presenceStatus}') must be 'online' | 'idle' | 'offline' | 'dnd' | 'invisible' | 'streaming' | 'phone'`,
    );

  const statusString = options.presenceStatus == "offline" ? "invisible" : options.presenceStatus!;

  const status = await loadImage(Buffer.from(statusImgs[statusString], "base64"));

  const cX = options.presenceStatus == "phone" ? 224.5 : 212;
  const cY = options.presenceStatus == "phone" ? 202 : 204;

  ctx.drawImage(canvasToEdit, 0, 0);

  ctx.globalCompositeOperation = "destination-out";

  if (options.presenceStatus == "phone") ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
  else ctx.roundRect(212, 204, 62, 62, [62]);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  ctx.drawImage(status, cX, cY);

  return canvas;
}
