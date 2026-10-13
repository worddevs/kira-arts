import "./profileImage.output.utils";

import {
  CARD_WIDTH,
  CARD_HEIGHT,
  createLevelUpCanvas,
  drawLevelUpCard,
  getCardDimensions,
  getSizeScale,
} from "./LevelUpCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, LevelUpLayout } from "../@Types/index";

export async function genLevelUpPng(
  layout: LevelUpLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout.size);
  const scale = getSizeScale(layout.size);
  const { canvas, ctx } = createLevelUpCanvas(width, height);

  ctx.save();
  ctx.scale(scale, scale);

  await drawLevelUpCard(ctx, CARD_WIDTH, CARD_HEIGHT, layout);

  ctx.restore();

  return encodeCanvas(canvas, output);
}
