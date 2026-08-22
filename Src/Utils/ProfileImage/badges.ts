import type { Canvas } from "@napi-rs/canvas";
import { createCanvas, loadImage } from "@napi-rs/canvas";

import { truncateText } from "../strings.utils";
import { parsePng } from "../validations.utils";
import { KiraError } from "../error.utils";
import type { ProfileOptions, KiraUserData, CanvasBadge } from "../../@Types/index";
import { KiraErrorCode } from "../../@Types/index";
import { otherImgs, clydeID } from "./constants";

export async function getBadges(
  data: KiraUserData,
  options: ProfileOptions,
): Promise<CanvasBadge[]> {
  const { assets } = data;

  const badges = [...(assets?.badges || [])];
  const canvasBadges: CanvasBadge[] = [];

  for (const badge of badges.reverse()) {
    const { name, icon } = badge;
    const canvas = await loadImage(icon).catch(() => undefined);
    if (!canvas) {
      throw new KiraError(
        `Could not load badge: (${name})\nIf you think it is not a network problem, please report it in our discord: https://discord.gg/csedxqGQKP`,
        KiraErrorCode.AssetLoad,
      );
    }

    canvasBadges.push({ canvas, x: 0, y: 15, w: 60 });
  }

  if (options?.customBadges?.length) {
    if (options?.overwriteBadges) {
      canvasBadges.splice(0, badges.length);
    }

    for (let i = 0; i < options.customBadges.length; i++) {
      const canvas = await loadImage(parsePng(options.customBadges[i])).catch(() => undefined);

      if (!canvas) {
        const truncatedBadge = truncateText(options.customBadges[i], 30);

        throw new KiraError(
          `Could not load custom badge: (${truncatedBadge}), make sure that the image exists.`,
          KiraErrorCode.AssetLoad,
        );
      }

      canvasBadges.push({ canvas, x: 10, y: 22, w: 46 });
    }
  }

  return canvasBadges;
}

export async function genBadges(badges: CanvasBadge[]): Promise<Canvas> {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  let x = 800;

  for (const badge of badges) {
    const { canvas: badgeCanvas, x: bX, y, w } = badge;
    const ratio = badgeCanvas.height / badgeCanvas.width;
    const drawH = w * ratio;

    ctx.drawImage(badgeCanvas, x + bX, y + (w - drawH) / 2, w, drawH);

    x -= 59;
  }

  return canvas;
}

export async function genBotVerifBadge(
  data: KiraUserData,
  badgeX: number,
  badgeY: number,
): Promise<Canvas> {
  const { basicInfo } = data;
  const { id, verified } = basicInfo;

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const isClyde = id === clydeID;

  const badgeName = isClyde ? "botAI" : verified ? "botVerif" : "botNoVerif";

  const botBadgeBase64 = otherImgs[badgeName];
  const botBagde = await loadImage(Buffer.from(botBadgeBase64, "base64"));

  ctx.drawImage(botBagde, badgeX, badgeY);

  return canvas;
}
