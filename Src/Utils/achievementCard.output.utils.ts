import "./profileImage.output.utils";

import type {
  AchievementLayout} from "./achievementCard.utils";
import {
  createAchievementCanvas,
  drawAchievementCard,
  getCardDimensions,
} from "./achievementCard.utils";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions } from "../@Types/index";

export async function genAchievementPng(
  layout: AchievementLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions();
  const { canvas, ctx } = createAchievementCanvas(width, height);

  await drawAchievementCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
