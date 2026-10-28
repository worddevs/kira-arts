import {
  type Canvas,
  type CanvasPattern,
  type CanvasGradient,
  type SKRSContext2D,
  createCanvas,
} from "@napi-rs/canvas";

import type { BorderMix } from "../@Types/index";
import { parseHex } from "./validations.utils";

interface LinearLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface MixState {
  randomSeed: number;
  canvases: Map<string, Canvas>;
}

const stateByColors = new WeakMap<string[], MixState>();

function getState(colors: string[]): MixState {
  let state = stateByColors.get(colors);
  if (!state) {
    state = { randomSeed: Math.floor(Math.random() * 0xffffffff), canvases: new Map() };
    stateByColors.set(colors, state);
  }
  return state;
}

function hashColors(colors: string[]): number {
  const text = colors.join("|");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildColorSequence(count: number, slots: number, rng: () => number): number[] {
  const sequence: number[] = [];

  while (sequence.length < slots) {
    const bag = shuffle(
      Array.from({ length: count }, (_, i) => i),
      rng,
    );

    if (sequence.length > 0 && bag[0] === sequence[sequence.length - 1]) {
      const swapWith = 1 + Math.floor(rng() * (bag.length - 1));
      [bag[0], bag[swapWith]] = [bag[swapWith], bag[0]];
    }

    for (const index of bag) {
      if (sequence.length < slots) sequence.push(index);
    }
  }

  if (sequence.length > 1 && sequence[0] === sequence[sequence.length - 1]) {
    const swapWith = 1 + Math.floor(rng() * (sequence.length - 2));
    [sequence[sequence.length - 1], sequence[swapWith]] = [
      sequence[swapWith],
      sequence[sequence.length - 1],
    ];
  }

  return sequence;
}

function pointOnPerimeter(
  distance: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const perimeter = 2 * (width + height);
  let d = ((distance % perimeter) + perimeter) % perimeter;

  if (d <= width) return { x: d, y: 0 };
  d -= width;
  if (d <= height) return { x: width, y: d };
  d -= height;
  if (d <= width) return { x: width - d, y: height };
  d -= width;
  return { x: 0, y: height - d };
}

function averageColor(colors: string[]): string {
  let r = 0;
  let g = 0;
  let b = 0;

  for (const color of colors) {
    const hex = parseHex(color).replace("#", "");
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    r += parseInt(full.slice(0, 2), 16);
    g += parseInt(full.slice(2, 4), 16);
    b += parseInt(full.slice(4, 6), 16);
  }

  const n = colors.length;
  return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
}

function withAlpha(color: string, alpha: number): string {
  const hex = parseHex(color).replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderMixCanvas(
  width: number,
  height: number,
  colors: string[],
  seed: number,
  randomized: boolean,
): Canvas {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const rng = createRng(seed);

  const perimeter = 2 * (width + height);
  const slots = colors.length * 3 + (randomized ? Math.floor(rng() * (colors.length + 1)) : 0);
  const sequence = buildColorSequence(colors.length, slots, rng);
  const startOffset = rng() * perimeter;
  const spacing = perimeter / slots;
  const radius = spacing * 0.95;

  ctx.fillStyle = averageColor(colors);
  ctx.fillRect(0, 0, width, height);

  const order = shuffle(
    Array.from({ length: slots }, (_, i) => i),
    rng,
  );

  for (const slot of order) {
    const jitter = (rng() - 0.5) * spacing * 0.7;
    const point = pointOnPerimeter(startOffset + slot * spacing + jitter, width, height);
    const color = colors[sequence[slot]];

    const blob = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
    blob.addColorStop(0, withAlpha(color, 1));
    blob.addColorStop(0.45, withAlpha(color, 0.92));
    blob.addColorStop(1, withAlpha(color, 0));

    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas;
}

export function createBorderPaint(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  colors: string[],
  mix: BorderMix | undefined,
  line: LinearLine,
): CanvasGradient | CanvasPattern {
  if (mix && mix !== "linear" && colors.length > 1) {
    const state = getState(colors);
    const key = `${mix}:${width}x${height}`;

    let canvas = state.canvases.get(key);
    if (!canvas) {
      const seed = mix === "random" ? state.randomSeed : hashColors(colors);
      canvas = renderMixCanvas(width, height, colors, seed, mix === "random");
      state.canvases.set(key, canvas);
    }

    const pattern = ctx.createPattern(canvas, "no-repeat");
    if (pattern) return pattern;
  }

  const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
  for (let i = 0; i < colors.length; i++) {
    const stop = colors.length === 1 ? 0 : i / (colors.length - 1);
    gradient.addColorStop(stop, parseHex(colors[i]));
  }

  return gradient;
}
