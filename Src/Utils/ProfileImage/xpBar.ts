import type { Canvas } from "@napi-rs/canvas";
import { createCanvas } from "@napi-rs/canvas";

import { abbreviateNumber } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { parseHex, isNumber } from "../validations.utils";
import { resolveCardColors } from "../canvasShared.utils";
import { KiraError } from "../error.utils";
import type { ProfileOptions } from "../../@Types/index";
import { alphaValue } from "./constants";

export function genXpBar(options: ProfileOptions): Canvas {
  const { currentXp, requiredXp, level, rank, barColor, levelColor, autoColorRank } =
    options.rankData!;

  if (isNaN(currentXp) || isNaN(requiredXp) || isNaN(level)) {
    throw new KiraError("rankData options requires: currentXp, requiredXp and level properties");
  }

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const mY = 8;

  ctx.fillStyle = "#000";
  ctx.globalAlpha = alphaValue;
  ctx.beginPath();
  ctx.roundRect(304, 248, 380, 33, [12]);
  ctx.fill();
  ctx.globalAlpha = 1;

  const rankString = !isNaN(rank as number)
    ? `RANK #${abbreviateNumber(isNumber(rank, "rankData:rank"))}`
    : "";
  const lvlString = !isNaN(level)
    ? `Lvl ${abbreviateNumber(isNumber(level, "rankData:level"))}`
    : "";

  ctx.font = withFallback("21px Helvetica");
  ctx.textAlign = "left";
  ctx.fillStyle = "#dadada";
  ctx.fillText(`${abbreviateNumber(currentXp)} / ${abbreviateNumber(requiredXp)} XP`, 314, 273);

  const rankColors: Record<string, string> = {
    gold: "#F1C40F",
    silver: "#a1a4c9",
    bronze: "#AD8A56",
    current: "#dadada",
  };

  const rankMapping: Record<string, string> = {
    "RANK #1": rankColors.gold,
    "RANK #2": rankColors.silver,
    "RANK #3": rankColors.bronze,
  };

  if (autoColorRank && Object.prototype.hasOwnProperty.call(rankMapping, rankString)) {
    rankColors.current = rankMapping[rankString];
  }

  ctx.font = withFallback("bold 21px Helvetica");
  ctx.textAlign = "right";
  ctx.fillStyle = rankColors.current;
  ctx.fillText(`${rankString}`, 674 - ctx.measureText(lvlString).width - 10, 273);

  ctx.font = withFallback("bold 21px Helvetica");
  ctx.textAlign = "right";
  ctx.fillStyle = levelColor ? parseHex(levelColor) : "#dadada";
  ctx.fillText(`${lvlString}`, 674, 273);

  ctx.globalAlpha = alphaValue;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, 557, 36, [14]);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, 557, 36, [14]);
  ctx.clip();

  const barColors = resolveCardColors({ custom: barColor });

  if (barColors.length > 20)
    throw new KiraError(
      `Invalid barColor length (${barColors.length}) must be a maximum of 20 colors`,
    );

  const barWidth = Math.round((currentXp * 556) / requiredXp);

  const grd = ctx.createLinearGradient(304, 197, 860, 197);

  for (let i = 0; i < barColors.length; i++) {
    const stop = barColors.length === 1 ? 0 : i / (barColors.length - 1);
    grd.addColorStop(stop, parseHex(barColors[i]));
  }

  ctx.fillStyle = barColors.length ? grd : "#fff";
  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, barWidth, 36, [14]);
  ctx.fill();

  return canvas;
}

export function addShadow(canvasToEdit: Canvas): Canvas {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");
  ctx.filter = "drop-shadow(0px 4px 4px #000)";
  ctx.globalAlpha = alphaValue;
  ctx.drawImage(canvasToEdit, 0, 0);

  return canvas;
}
