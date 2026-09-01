import type { SKRSContext2D } from "@napi-rs/canvas";

import type { ConfettiParticle } from "../@Types/common";

const CONFETTI_PALETTE = ["#FFFFFF", "#FFD166", "#EF476F", "#06D6A0", "#118AB2"];

export function generateConfetti(
  width: number,
  height: number,
  accentColor: string,
  count = 26,
): ConfettiParticle[] {
  const palette = [accentColor, ...CONFETTI_PALETTE];
  const particles: ConfettiParticle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      startY: Math.random() * height,
      speed: height * (0.35 + Math.random() * 0.5),
      size: 4 + Math.random() * 5,
      color: palette[Math.floor(Math.random() * palette.length)],
      drift: (Math.random() - 0.5) * 30,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.4,
    });
  }

  return particles;
}

export function drawConfettiFrame(
  ctx: SKRSContext2D,
  particles: ConfettiParticle[],
  frameIndex: number,
  frameCount: number,
  width: number,
  height: number,
): void {
  const t = frameIndex / frameCount;
  const wrap = height + 40;

  for (const p of particles) {
    const y = (((p.startY + t * p.speed) % wrap) + wrap) % wrap;
    const x = p.x + Math.sin(t * Math.PI * 2 + p.startY) * p.drift;
    const rotation = p.rotation + t * Math.PI * 2 * p.spin;

    ctx.save();
    ctx.translate(x, y - 20);
    ctx.rotate(rotation);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  void width;
}
