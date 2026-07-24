import type { Image, SKRSContext2D } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";
import type { ColorResolutionSources } from "../@Types/index";
import { parseHex } from "./validations.utils";

export function resolveCardColors(sources: ColorResolutionSources): string[] {
  if (sources.removeBorder) return [];

  if (typeof sources.custom !== "undefined") {
    const list = Array.isArray(sources.custom) ? sources.custom : [sources.custom];
    return list.map((color) => parseHex(color));
  }

  if (sources.useNitroTheme && sources.nitroColors && sources.nitroColors.length > 0) {
    return sources.nitroColors.map((color) => parseHex(color));
  }

  if (sources.useRoleColor && sources.roleColor) {
    return [parseHex(sources.roleColor)];
  }

  return (sources.fallback ?? []).map((color) =>
    typeof color === "string" ? color : parseHex(color),
  );
}

export async function loadImageSafe(
  url: string | undefined,
  attempts = 3,
  timeoutMs = 8000,
): Promise<Image | undefined> {
  if (!url) return undefined;

  const isRemote = /^https?:\/\//i.test(url);
  if (!isRemote) {
    return loadImage(url).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);

      console.warn("[arts] failed to load local image:", url, message);

      return undefined;
    });
  }

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; kira-arts/1.0)" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      return await loadImage(Buffer.from(arrayBuffer));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt === attempts) {
        console.warn("[arts] failed to load image after retries:", url, message);

        return undefined;
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    } finally {
      clearTimeout(timer);
    }
  }

  return undefined;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = parseHex(hex).replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function drawGradientBorder(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  colors: string[],
  cornerRadius: number,
  thickness = 5,
): void {
  const grd = ctx.createLinearGradient(0, 0, width, height);
  for (let i = 0; i < colors.length; i++) {
    const stop = colors.length === 1 ? 0 : i / (colors.length - 1);
    grd.addColorStop(stop, parseHex(colors[i]));
  }

  ctx.save();
  ctx.lineWidth = thickness;
  ctx.strokeStyle = grd;
  ctx.beginPath();
  ctx.roundRect(thickness / 2, thickness / 2, width - thickness, height - thickness, [
    Math.max(0, cornerRadius - thickness / 2),
  ]);
  ctx.stroke();
  ctx.restore();
}

export function drawCoverImage(
  ctx: SKRSContext2D,
  image: Image,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const scale = Math.max(w / image.width, h / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(image, dx, dy, drawW, drawH);
  ctx.restore();
}
