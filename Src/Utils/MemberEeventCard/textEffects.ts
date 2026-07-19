import type { SKRSContext2D } from "@napi-rs/canvas";

import type { TextEffect } from "./constants";

export function applyTextEffect(
  ctx: SKRSContext2D,
  effect: TextEffect | undefined,
  glowColor: string,
): void {
  if (effect === "shadow") {
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
  } else if (effect === "glow") {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}
