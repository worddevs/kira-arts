import { createCanvas } from "@napi-rs/canvas";

import { withFallback } from "../fonts.utils";
import {
  FONT_SIZE,
  LINE_HEIGHT,
  TITLE_BAR_HEIGHT,
  CODE_PADDING_X,
  CODE_PADDING_Y,
  GUTTER_GAP,
  OUTER_PADDING,
  MIN_CODE_WIDTH,
  MAX_CODE_WIDTH,
} from "./constants";
import type { CodeSnippetLayout, CodeSnippetDimensions } from "../../@Types/index";

export function getCardDimensions(layout: CodeSnippetLayout): CodeSnippetDimensions {
  const lines = layout.code.replace(/\t/g, "  ").split("\n");
  const scratch = createCanvas(10, 10).getContext("2d");
  scratch.font = withFallback(`bold ${FONT_SIZE}px Cousine`);

  let maxLineWidth = 0;
  for (const line of lines) {
    const width = scratch.measureText(line).width;
    if (width > maxLineWidth) maxLineWidth = width;
  }

  const codeAreaWidth = Math.min(
    MAX_CODE_WIDTH,
    Math.max(MIN_CODE_WIDTH, Math.ceil(maxLineWidth) + 4),
  );

  let gutterWidth = 0;
  if (layout.showLineNumbers) {
    const lastLineNumber = layout.startLine + lines.length - 1;
    const digits = Math.max(2, String(lastLineNumber).length);
    gutterWidth = scratch.measureText("0".repeat(digits)).width + GUTTER_GAP;
  }

  const windowWidth = codeAreaWidth + CODE_PADDING_X * 2 + gutterWidth;
  const windowHeight = TITLE_BAR_HEIGHT + CODE_PADDING_Y * 2 + lines.length * LINE_HEIGHT;

  return {
    width: windowWidth + OUTER_PADDING * 2,
    height: windowHeight + OUTER_PADDING * 2,
    windowWidth,
    windowHeight,
    gutterWidth,
    codeAreaWidth,
    lines,
  };
}

export function createCodeSnippetCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
}
