import "./profileImage.output.utils";

import type {
  LevelUpLayout} from "./LevelUpCard/index";
import {
  createLevelUpCanvas,
  drawLevelUpCard,
  getCardDimensions,
} from "./LevelUpCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions } from "../@Types/index";

export async function genLevelUpPng(
  layout: LevelUpLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions();
  const { canvas, ctx } = createLevelUpCanvas(width, height);

  await drawLevelUpCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
