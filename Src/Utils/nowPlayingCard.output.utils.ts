import "./profileImage.output.utils";

import type { NowPlayingLayout } from "../@Types/index";
import {
  createNowPlayingCanvas,
  drawNowPlayingCard,
  getCardDimensions,
} from "./NowPlayingCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions } from "../@Types/index";

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
