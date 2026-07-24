import type { SKRSContext2D } from "@napi-rs/canvas";

import type { SourceIconKind } from "../../@Types/index";

export function drawSourceIcon(
  ctx: SKRSContext2D,
  kind: SourceIconKind,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  switch (kind) {
    case "play": {
      const r = size / 2;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.55, cy - r * 0.75);
      ctx.lineTo(cx - r * 0.55, cy + r * 0.75);
      ctx.lineTo(cx + r * 0.85, cy);
      ctx.closePath();
      ctx.fill();

      break;
    }

    case "waves": {
      ctx.lineWidth = Math.max(1.5, size * 0.11);
      ctx.lineCap = "round";
      const bars = 3;
      const gap = size / (bars + 1);
      for (let i = 0; i < bars; i++) {
        const h = size * (0.35 + i * 0.28) * (i === 1 ? 1 : 0.85);
        const x = cx - size / 2 + gap * (i + 1);
        ctx.beginPath();
        ctx.moveTo(x, cy + h / 2);
        ctx.lineTo(x, cy - h / 2);
        ctx.stroke();
      }

      break;
    }

    case "cloud": {
      const r = size * 0.22;

      ctx.beginPath();
      ctx.arc(cx - r * 0.9, cy + r * 0.3, r * 0.85, 0, Math.PI * 2);
      ctx.arc(cx, cy - r * 0.2, r * 1.05, 0, Math.PI * 2);
      ctx.arc(cx + r * 1.05, cy + r * 0.35, r * 0.9, 0, Math.PI * 2);
      ctx.rect(cx - r * 1.6, cy + r * 0.3, r * 3.3, r * 0.9);
      ctx.fill();

      break;
    }

    case "bolt": {
      const r = size / 2;
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.15, cy - r * 0.9);
      ctx.lineTo(cx - r * 0.55, cy + r * 0.15);
      ctx.lineTo(cx - r * 0.05, cy + r * 0.15);
      ctx.lineTo(cx - r * 0.2, cy + r * 0.9);
      ctx.lineTo(cx + r * 0.6, cy - r * 0.1);
      ctx.lineTo(cx + r * 0.05, cy - r * 0.1);
      ctx.closePath();
      ctx.fill();

      break;
    }

    case "note":
    default: {
      const r = size * 0.16;
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.22, cy + size * 0.28, r, r * 0.75, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.22 + r * 0.9, cy + size * 0.28 - r * 0.2);
      ctx.lineTo(cx - size * 0.22 + r * 0.9, cy - size * 0.42);
      ctx.lineTo(cx + size * 0.3, cy - size * 0.5);
      ctx.lineTo(cx + size * 0.3, cy - size * 0.18);
      ctx.lineWidth = Math.max(1.5, size * 0.11);
      ctx.stroke();

      break;
    }
  }

  ctx.restore();
}
