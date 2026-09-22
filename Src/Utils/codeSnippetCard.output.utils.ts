import "./profileImage.output.utils";

import {
  createCodeSnippetCanvas,
  drawCodeSnippetCard,
  getCardDimensions,
} from "./CodeSnippetCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, CodeSnippetLayout } from "../@Types/index";

export async function genCodeSnippetPng(
  layout: CodeSnippetLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const dims = getCardDimensions(layout);
  const { canvas, ctx } = createCodeSnippetCanvas(dims.width, dims.height);

  drawCodeSnippetCard(ctx, dims.width, dims.height, layout, dims);

  return encodeCanvas(canvas, output);
}
