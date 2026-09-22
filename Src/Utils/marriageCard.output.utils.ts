import "./profileImage.output.utils";

import { createMarriageCanvas, drawMarriageCard, getCardDimensions } from "./MarriageCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, MarriageLayout } from "../@Types/index";

export async function genMarriagePng(
  layout: MarriageLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout);
  const { canvas, ctx } = createMarriageCanvas(width, height);

  await drawMarriageCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
