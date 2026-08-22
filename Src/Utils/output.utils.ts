import type { Canvas } from "@napi-rs/canvas";

import { KiraError } from "./error.utils";
import type { OutputFormat, OutputOptions } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

const MIME_MAP: Record<OutputFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

const DEFAULT_QUALITY = 90;

export async function encodeCanvas(canvas: Canvas, output?: OutputOptions): Promise<Buffer> {
  const format = output?.format ?? "png";
  const mime = MIME_MAP[format];

  if (!mime) {
    throw new KiraError(
      `Invalid output format ('${output?.format}'), must be one of: png, jpeg, webp`,
      KiraErrorCode.Validation,
    );
  }

  if (format === "png") {
    return canvas.toBuffer("image/png");
  }

  const quality = output?.quality ?? DEFAULT_QUALITY;
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    throw new KiraError(
      `Invalid output quality (${output?.quality}), must be a number between 1 and 100`,
      KiraErrorCode.Validation,
    );
  }

  return canvas.toBuffer(mime as "image/jpeg" | "image/webp", quality);
}

export function extensionForFormat(format?: OutputFormat): string {
  if (format === "jpeg") return "jpg";
  if (format === "webp") return "webp";
  return "png";
}
