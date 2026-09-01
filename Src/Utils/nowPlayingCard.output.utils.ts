import "./profileImage.output.utils";

import type { NowPlayingLayout, OutputOptions } from "../@Types/index";
import {
  createNowPlayingCanvas,
  drawNowPlayingCard,
  getCardDimensions,
} from "./NowPlayingCard/index";
import { encodeCanvas } from "./output.utils";

export async function genNowPlayingPng(
  layout: NowPlayingLayout,
  customWidth?: number,
  customHeight?: number,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(customWidth, customHeight);
  const { canvas, ctx } = createNowPlayingCanvas(width, height);

  await drawNowPlayingCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
