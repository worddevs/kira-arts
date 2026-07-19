import "./profileImage.output.utils";

import type { ShipLayout} from "./ShipCard/index";
import { createShipCanvas, drawShipCard, getCardDimensions } from "./ShipCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions } from "../@Types/index";

export async function genShipPng(layout: ShipLayout, output?: OutputOptions): Promise<Buffer> {
  const { width, height } = getCardDimensions();
  const { canvas, ctx } = createShipCanvas(width, height);

  await drawShipCard(ctx, width, height, layout);

  return encodeCanvas(canvas, output);
}
