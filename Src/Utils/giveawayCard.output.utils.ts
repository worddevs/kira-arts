import "./profileImage.output.utils";

import { createGiveawayCanvas, drawGiveawayCard, getCardDimensions } from "./GiveawayCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, GiveawayLayout } from "../@Types/index";

export async function genGiveawayPng(
  layout: GiveawayLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout);
  const { canvas, ctx } = createGiveawayCanvas(width, height);

  await drawGiveawayCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
