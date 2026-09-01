import gifenc from "gifenc";

import type { GifFrame } from "../@Types/index";

const { GIFEncoder, quantize, applyPalette } = gifenc;

function buildSharedPalette(frames: GifFrame[]): number[][] {
  const sampleCount = Math.min(frames.length, 6);
  const step = Math.max(1, Math.floor(frames.length / sampleCount));
  const sampled: GifFrame[] = [];

  for (let i = 0; i < frames.length; i += step) {
    sampled.push(frames[i]);
  }
  if (!sampled.includes(frames[frames.length - 1])) {
    sampled.push(frames[frames.length - 1]);
  }

  const totalLength = sampled.reduce((sum, f) => sum + f.data.length, 0);
  const combined = new Uint8ClampedArray(totalLength);
  let offset = 0;
  for (const frame of sampled) {
    combined.set(frame.data, offset);
    offset += frame.data.length;
  }

  return quantize(combined, 256);
}

export function encodeGif(frames: GifFrame[], delayMs: number): Buffer {
  if (!frames.length) throw new Error("encodeGif requires at least one frame");

  const gif = GIFEncoder();
  const palette = buildSharedPalette(frames);

  for (const frame of frames) {
    const index = applyPalette(frame.data, palette);
    gif.writeFrame(index, frame.width, frame.height, {
      palette,
      delay: delayMs,
      transparent: false,
    });
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}
