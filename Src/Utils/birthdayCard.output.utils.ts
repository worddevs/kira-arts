import "./profileImage.output.utils";

import { createBirthdayCanvas, drawBirthdayCard, getCardDimensions } from "./BirthdayCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, BirthdayLayout } from "../@Types/index";

export async function genBirthdayPng(
  layout: BirthdayLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout);
  const { canvas, ctx } = createBirthdayCanvas(width, height);

  await drawBirthdayCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
