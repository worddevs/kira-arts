import { describe, expect, it } from "vitest";

import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { getCardDimensions, getSizeScale, normalizeSize } from "./dimensions";

describe("LevelUpCard dimensions", () => {
  it("keeps the original 700x260 card for the default size", () => {
    expect(getCardDimensions()).toEqual({ width: CARD_WIDTH, height: CARD_HEIGHT });
    expect(getCardDimensions("standard")).toEqual({ width: 700, height: 260 });
  });

  it("returns a smaller card for compact and a larger one for wide", () => {
    expect(getCardDimensions("compact")).toEqual({ width: 560, height: 208 });
    expect(getCardDimensions("wide")).toEqual({ width: 840, height: 312 });
  });

  it("preserves the aspect ratio for every size", () => {
    for (const size of ["compact", "standard", "wide"] as const) {
      const { width, height } = getCardDimensions(size);
      expect(width / height).toBeCloseTo(CARD_WIDTH / CARD_HEIGHT, 5);
    }
  });

  it("falls back to standard for unknown values", () => {
    expect(normalizeSize(undefined)).toBe("standard");
    expect(normalizeSize("huge" as never)).toBe("standard");
    expect(getSizeScale("huge" as never)).toBe(1);
  });
});
