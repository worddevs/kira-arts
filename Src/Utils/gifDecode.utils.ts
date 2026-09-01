import { createCanvas, type Canvas } from "@napi-rs/canvas";
import { parseGIF, decompressFrames } from "gifuct-js";

import type { DecodedGifFrame, DecodedAnimatedGif, FetchedImageSource } from "../@Types/index";

const MIN_FRAME_DELAY_MS = 20;

export async function fetchImageSource(url: string): Promise<FetchedImageSource | null> {
  const bytes = await fetchBytes(url);
  if (!bytes) return null;
  return { bytes, animated: decodeAnimatedGifFromBytes(bytes) };
}

export async function decodeAnimatedGif(url: string): Promise<DecodedAnimatedGif | null> {
  const bytes = await fetchBytes(url);
  if (!bytes) return null;
  return decodeAnimatedGifFromBytes(bytes);
}

function decodeAnimatedGifFromBytes(bytes: Uint8Array): DecodedAnimatedGif | null {
  if (bytes.length < 6) return null;

  const header = String.fromCharCode(bytes[0], bytes[1], bytes[2]);
  if (header !== "GIF") return null;

  let parsed;
  try {
    const arrayBuffer = new Uint8Array(bytes).buffer as ArrayBuffer;
    parsed = parseGIF(arrayBuffer);
  } catch {
    return null;
  }

  const rawFrames = decompressFrames(parsed, true);
  if (!rawFrames.length) return null;

  const width = parsed.lsd.width;
  const height = parsed.lsd.height;
  if (rawFrames.length === 1) return null;

  const composeCanvas = createCanvas(width, height);
  const composeCtx = composeCanvas.getContext("2d");

  const frames: DecodedGifFrame[] = [];
  let savedImageData: ReturnType<typeof composeCtx.getImageData> | undefined;

  for (const frame of rawFrames) {
    const { left, top, width: fw, height: fh } = frame.dims;

    if (frame.disposalType === 3) {
      savedImageData = composeCtx.getImageData(0, 0, width, height);
    }

    const regionData = composeCtx.getImageData(left, top, fw, fh);
    const regionPixels = regionData.data;
    const patchPixels = frame.patch;

    for (let i = 0; i < patchPixels.length; i += 4) {
      if (patchPixels[i + 3] === 0) continue;
      regionPixels[i] = patchPixels[i];
      regionPixels[i + 1] = patchPixels[i + 1];
      regionPixels[i + 2] = patchPixels[i + 2];
      regionPixels[i + 3] = patchPixels[i + 3];
    }

    composeCtx.putImageData(regionData, left, top);

    const frameCanvas = createCanvas(width, height);
    frameCanvas.getContext("2d").drawImage(composeCanvas, 0, 0);

    frames.push({
      canvas: frameCanvas,
      delay: Math.max(frame.delay || 100, MIN_FRAME_DELAY_MS),
    });

    if (frame.disposalType === 2) {
      composeCtx.clearRect(left, top, fw, fh);
    } else if (frame.disposalType === 3 && savedImageData) {
      composeCtx.putImageData(savedImageData, 0, 0);
    }
  }

  const totalDuration = frames.reduce((sum, f) => sum + f.delay, 0);
  return { frames, width, height, totalDuration };
}

export function frameAtTime(gif: DecodedAnimatedGif, elapsedMs: number): Canvas {
  const t = ((elapsedMs % gif.totalDuration) + gif.totalDuration) % gif.totalDuration;
  let cursor = 0;

  for (const frame of gif.frames) {
    cursor += frame.delay;
    if (t < cursor) return frame.canvas;
  }

  return gif.frames[gif.frames.length - 1].canvas;
}

async function fetchBytes(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}
