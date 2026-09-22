import "./profileImage.output.utils";

import {
  createWeeklyRecapCanvas,
  drawWeeklyRecapCard,
  getCardDimensions,
} from "./WeeklyRecapCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, WeeklyRecapLayout } from "../@Types/index";

export async function genWeeklyRecapPng(
  layout: WeeklyRecapLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions();
  const { canvas, ctx } = createWeeklyRecapCanvas(width, height);

  await drawWeeklyRecapCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
