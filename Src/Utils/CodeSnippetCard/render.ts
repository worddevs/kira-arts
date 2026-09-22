import type { SKRSContext2D } from "@napi-rs/canvas";

import { hexToRgba } from "../canvasShared.utils";
import { withFallback } from "../fonts.utils";
import {
  FONT_SIZE,
  LINE_HEIGHT,
  TITLE_BAR_HEIGHT,
  CODE_PADDING_X,
  CODE_PADDING_Y,
  GUTTER_GAP,
  WINDOW_RADIUS,
  OUTER_PADDING,
} from "./constants";
import { getCodeSnippetPalette } from "./palettes";
import { tokenizeLine } from "./highlight";
import {
  drawTrafficLights,
  drawFileTab,
  drawLanguageBadge,
  measureFileTabWidth,
} from "./decorations";
import type { CodeSnippetLayout, TokenType, CodeSnippetDimensions } from "../../@Types/index";

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  json: "JSON",
  bash: "Bash",
  plaintext: "Plain Text",
};

function tokenColor(type: TokenType, palette: ReturnType<typeof getCodeSnippetPalette>): string {
  switch (type) {
    case "comment":
      return palette.comment;
    case "string":
      return palette.string;
    case "number":
      return palette.number;
    case "keyword":
      return palette.keyword;
    case "function":
      return palette.function;
    case "punctuation":
      return palette.punctuation;
    default:
      return palette.text;
  }
}

export function drawCodeSnippetCard(
  ctx: SKRSContext2D,
  width: number,
  height: number,
  layout: CodeSnippetLayout,
  dims: CodeSnippetDimensions,
): void {
  const palette = getCodeSnippetPalette(layout.theme);
  const accent = layout.accentColor ?? palette.accent;
  const { windowWidth, windowHeight, gutterWidth, lines } = dims;
  const windowX = OUTER_PADDING;
  const windowY = OUTER_PADDING;

  const pageGrd = ctx.createLinearGradient(0, 0, width, height);
  pageGrd.addColorStop(0, palette.pageGradient[0]);
  pageGrd.addColorStop(1, palette.pageGradient[1]);
  ctx.fillStyle = pageGrd;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    windowX + windowWidth / 2,
    windowY,
    10,
    windowX + windowWidth / 2,
    windowY,
    windowWidth * 0.75,
  );
  glow.addColorStop(0, hexToRgba(accent, 0.22));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.beginPath();
  ctx.roundRect(windowX, windowY, windowWidth, windowHeight, [WINDOW_RADIUS]);
  ctx.fillStyle = palette.windowBackground;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(windowX, windowY, windowWidth, windowHeight, [WINDOW_RADIUS]);
  ctx.clip();

  ctx.fillStyle = palette.headerBackground;
  ctx.fillRect(windowX, windowY, windowWidth, TITLE_BAR_HEIGHT);

  ctx.strokeStyle = hexToRgba(palette.borderColor, 0.8);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(windowX, windowY + TITLE_BAR_HEIGHT);
  ctx.lineTo(windowX + windowWidth, windowY + TITLE_BAR_HEIGHT);
  ctx.stroke();

  drawTrafficLights(ctx, windowX + 24, windowY + TITLE_BAR_HEIGHT / 2);

  const tabLabel = layout.fileName ?? layout.windowTitle;
  const languageLabel = LANGUAGE_LABELS[layout.language] ?? layout.language;

  if (tabLabel) {
    ctx.font = withFallback("bold 11px Helvetica Bold");
    const badgeWidth = ctx.measureText(languageLabel.toUpperCase()).width + 24;
    const tabWidth = measureFileTabWidth(ctx, tabLabel);
    const safeLeft = windowX + 86;
    const safeRight = windowX + windowWidth - 18 - badgeWidth - 16;
    const idealCenter = windowX + windowWidth / 2;
    const centerX = Math.min(
      Math.max(idealCenter, safeLeft + tabWidth / 2),
      Math.max(safeLeft + tabWidth / 2, safeRight - tabWidth / 2),
    );

    drawFileTab(
      ctx,
      centerX,
      windowY + (TITLE_BAR_HEIGHT - 28) / 2,
      tabLabel,
      accent,
      palette.text,
    );
  }

  drawLanguageBadge(
    ctx,
    windowX + windowWidth - 18,
    windowY + (TITLE_BAR_HEIGHT - 22) / 2,
    languageLabel,
    accent,
  );

  const codeStartY = windowY + TITLE_BAR_HEIGHT + CODE_PADDING_Y;
  const lineX = windowX + CODE_PADDING_X + gutterWidth;
  const highlightSet = new Set(layout.highlightLines);

  ctx.font = withFallback(`${FONT_SIZE}px Cousine`);
  ctx.textBaseline = "middle";

  for (let i = 0; i < lines.length; i++) {
    const rowTop = codeStartY + i * LINE_HEIGHT;
    const rowCenterY = rowTop + LINE_HEIGHT / 2;
    const lineNumber = layout.startLine + i;
    const isHighlighted = highlightSet.has(lineNumber);

    if (isHighlighted) {
      ctx.fillStyle = hexToRgba(accent, 0.12);
      ctx.fillRect(windowX + 1, rowTop, windowWidth - 2, LINE_HEIGHT);
      ctx.fillStyle = accent;
      ctx.fillRect(windowX + 1, rowTop, 3, LINE_HEIGHT);
    }

    if (layout.showLineNumbers) {
      ctx.textAlign = "right";
      ctx.font = withFallback(`${FONT_SIZE - 1}px Cousine`);
      ctx.fillStyle = isHighlighted ? hexToRgba(accent, 0.9) : palette.gutterColor;
      ctx.fillText(`${lineNumber}`, lineX - GUTTER_GAP * 0.6, rowCenterY);
    }

    ctx.textAlign = "left";
    let cursorX = lineX;
    const tokens = tokenizeLine(lines[i], layout.language);

    for (const token of tokens) {
      ctx.font = withFallback(`${token.type === "keyword" ? "bold " : ""}${FONT_SIZE}px Cousine`);
      ctx.fillStyle = tokenColor(token.type, palette);
      ctx.fillText(token.text, cursorX, rowCenterY);
      cursorX += ctx.measureText(token.text).width;
    }
  }

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(windowX + 0.75, windowY + 0.75, windowWidth - 1.5, windowHeight - 1.5, [
    WINDOW_RADIUS,
  ]);
  ctx.strokeStyle = hexToRgba(palette.borderColor, 0.9);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}
