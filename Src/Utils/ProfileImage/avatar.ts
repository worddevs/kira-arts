import type { Canvas } from "@napi-rs/canvas";
import { createCanvas, loadImage } from "@napi-rs/canvas";

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
  ctx.drawImage(avatarFrame, 25, 18, 269, 269);

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
