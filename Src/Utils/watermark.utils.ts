import { type Canvas, type Image, loadImage } from "@napi-rs/canvas";

import type { KiraWatermarkOptions } from "../@Types/common";

let watermarkConfig: KiraWatermarkOptions | null = null;
let cachedImage: { url: string; image: Image } | null = null;

export function setWatermark(options: KiraWatermarkOptions | null): void {
  watermarkConfig = options;
  if (!options?.imageUrl || options.imageUrl !== cachedImage?.url) {
    cachedImage = null;
  }
}

export function getWatermark(): KiraWatermarkOptions | null {
  return watermarkConfig;
}

async function resolveWatermarkImage(url: string): Promise<Image | undefined> {
  if (cachedImage && cachedImage.url === url) return cachedImage.image;

  const image = await loadImage(url).catch(() => undefined);
  if (image) cachedImage = { url, image };
  return image;
}

export async function applyWatermarkToCanvas(canvas: Canvas): Promise<void> {
  const config = watermarkConfig;
  if (!config || (!config.text && !config.imageUrl)) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const margin = config.margin ?? 16;
  const scale = config.scale && config.scale > 0 ? config.scale : 1;
  const opacity = config.opacity != null ? Math.min(1, Math.max(0, config.opacity)) : 0.6;
  const fontSize = (config.fontSize ?? 13) * scale;
  const position = config.position ?? "bottom-right";
  const isRight = position === "bottom-right" || position === "top-right";
  const isBottom = position === "bottom-right" || position === "bottom-left";

  const logo = config.imageUrl ? await resolveWatermarkImage(config.imageUrl) : undefined;
  const logoSize = 20 * scale;
  const gap = 8 * scale;

  let contentWidth = 0;
  if (logo) contentWidth += logoSize;
  if (config.text) {
    ctx.font = `${fontSize}px sans-serif`;
    contentWidth += (logo ? gap : 0) + ctx.measureText(config.text).width;
  }

  const startX = isRight ? width - margin - contentWidth : margin;
  const centerY = isBottom ? height - margin - logoSize / 2 : margin + logoSize / 2;

  ctx.save();
  ctx.globalAlpha = opacity;

  let cursorX = startX;

  if (logo) {
    ctx.drawImage(logo, cursorX, centerY - logoSize / 2, logoSize, logoSize);
    cursorX += logoSize + (config.text ? gap : 0);
  }

  if (config.text) {
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = config.color ?? "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(config.text, cursorX, centerY);
  }

  ctx.restore();
}
