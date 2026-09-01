import "./profileImage.output.utils";

import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";

import {
  createMemberEventCanvas,
  drawMemberEventCard,
  getCardDimensions,
} from "./MemberEeventCard/index";
import { encodeCanvas } from "./output.utils";
import { applyWatermarkToCanvas } from "./watermark.utils";
import { generateConfetti, drawConfettiFrame } from "./confetti.utils";
import { encodeGif } from "./gif.utils";
import { fetchImageSource, frameAtTime } from "./gifDecode.utils";
import type { OutputOptions, MemberEventLayout } from "../@Types/index";

const GIF_FRAME_DELAY_MS = 60;
const GIF_DEFAULT_DURATION_MS = 4000;
const GIF_MIN_DURATION_MS = 1000;
const GIF_MAX_DURATION_MS = 10000;

function resolveGifFrameCount(gifSeconds: number | undefined): number {
  const requestedMs = gifSeconds && gifSeconds > 0 ? gifSeconds * 1000 : GIF_DEFAULT_DURATION_MS;
  const clampedMs = Math.min(Math.max(requestedMs, GIF_MIN_DURATION_MS), GIF_MAX_DURATION_MS);
  return Math.round(clampedMs / GIF_FRAME_DELAY_MS);
}

const GIF_CORNER_FILL = "#111318";

function fillOpaqueBase(ctx: SKRSContext2D, width: number, height: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = GIF_CORNER_FILL;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

async function resolveStaticImage(bytes: Uint8Array | undefined, fallbackUrl: string) {
  if (bytes) {
    const image = await loadImage(Buffer.from(bytes)).catch(() => undefined);
    if (image) return image;
  }
  return loadImage(fallbackUrl).catch(() => undefined);
}

async function renderAnimatedMemberEvent(
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
  width: number,
  height: number,
): Promise<Buffer> {
  const avatarSource = await fetchImageSource(avatarUrl).catch(() => null);
  const animatedAvatar = avatarSource?.animated ?? null;
  const avatarImage = animatedAvatar
    ? undefined
    : await resolveStaticImage(avatarSource?.bytes, avatarUrl);

  const backgroundSource = layout.customBackground
    ? await fetchImageSource(layout.customBackground).catch(() => null)
    : null;
  const animatedBackground = backgroundSource?.animated ?? null;
  const staticBackgroundImage =
    !animatedBackground && layout.customBackground
      ? await resolveStaticImage(backgroundSource?.bytes, layout.customBackground)
      : undefined;

  const wantsConfetti = layout.confetti === true;
  const frameCount = resolveGifFrameCount(layout.gifSeconds);

  if (!animatedBackground && !animatedAvatar && !wantsConfetti) {
    return renderStaticMemberEventGif(
      avatarUrl,
      username,
      layout,
      width,
      height,
      avatarImage,
      staticBackgroundImage,
    );
  }

  const particles = wantsConfetti ? generateConfetti(width, height, layout.accentColor) : [];
  const frames = [];

  if (animatedBackground || animatedAvatar) {
    for (let i = 0; i < frameCount; i++) {
      const elapsedMs = i * GIF_FRAME_DELAY_MS;
      const backgroundFrame = animatedBackground
        ? frameAtTime(animatedBackground, elapsedMs)
        : staticBackgroundImage;
      const avatarFrame = animatedAvatar ? frameAtTime(animatedAvatar, elapsedMs) : avatarImage;

      const frameCanvas = createCanvas(width, height);
      const frameCtx = frameCanvas.getContext("2d");
      fillOpaqueBase(frameCtx, width, height);

      await drawMemberEventCard(frameCtx, width, height, avatarUrl, username, layout, {
        avatarImage: avatarFrame,
        backgroundImage: backgroundFrame,
      });
      await applyWatermarkToCanvas(frameCanvas);
      if (wantsConfetti) {
        drawConfettiFrame(frameCtx, particles, i, frameCount, width, height);
      }

      const imageData = frameCtx.getImageData(0, 0, width, height);
      frames.push({ data: imageData.data, width, height });
    }

    return encodeGif(frames, GIF_FRAME_DELAY_MS);
  }

  const base = createCanvas(width, height);
  const baseCtx = base.getContext("2d");
  fillOpaqueBase(baseCtx, width, height);
  await drawMemberEventCard(baseCtx, width, height, avatarUrl, username, layout, {
    avatarImage,
    backgroundImage: staticBackgroundImage,
  });
  await applyWatermarkToCanvas(base);

  for (let i = 0; i < frameCount; i++) {
    const frameCanvas = createCanvas(width, height);
    const frameCtx = frameCanvas.getContext("2d");
    frameCtx.drawImage(base, 0, 0);
    drawConfettiFrame(frameCtx, particles, i, frameCount, width, height);

    const imageData = frameCtx.getImageData(0, 0, width, height);
    frames.push({ data: imageData.data, width, height });
  }

  return encodeGif(frames, GIF_FRAME_DELAY_MS);
}

async function renderStaticMemberEventGif(
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
  width: number,
  height: number,
  avatarImage: Awaited<ReturnType<typeof loadImage>> | undefined,
  backgroundImage: Awaited<ReturnType<typeof loadImage>> | undefined,
): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  fillOpaqueBase(ctx, width, height);
  await drawMemberEventCard(ctx, width, height, avatarUrl, username, layout, {
    avatarImage,
    backgroundImage,
  });
  await applyWatermarkToCanvas(canvas);

  const imageData = ctx.getImageData(0, 0, width, height);
  return encodeGif([{ data: imageData.data, width, height }], GIF_FRAME_DELAY_MS);
}

export async function genMemberEventPng(
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout);

  if (layout.animated) {
    return renderAnimatedMemberEvent(avatarUrl, username, layout, width, height);
  }

  const { canvas, ctx } = createMemberEventCanvas(width, height);

  await drawMemberEventCard(ctx, width, height, avatarUrl, username, layout);

  return encodeCanvas(canvas, output);
}
