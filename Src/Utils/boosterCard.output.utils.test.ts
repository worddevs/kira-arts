import { describe, expect, it } from "vitest";

import { genBoosterPng } from "./boosterCard.output.utils";
import { getCardDimensions } from "./BoosterCard/index";
import type { BoosterLayout, CardSize } from "../@Types/index";

function pngSize(buffer: Buffer): { width: number; height: number } {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function layout(overrides: Partial<BoosterLayout> = {}): BoosterLayout {
  return {
    kindLabel: "NEW BOOSTER",
    message: "Thanks for boosting Kira HQ!",
    boostCount: 14,
    boostText: "14 boosts · Level 3",
    boostLevel: 3,
    accentColor: "#FF73FA",
    borderColors: ["#FF73FA", "#7C3AED"],
    ...overrides,
  };
}

describe("getCardDimensions", () => {
  it.each([
    ["compact", 560],
    ["standard", 700],
    ["wide", 940],
  ] as const)("centered %s card is %i wide", (size: CardSize, width) => {
    expect(getCardDimensions(layout({ size })).width).toBe(width);
  });

  it.each([
    ["compact", 480, 170],
    ["standard", 700, 200],
    ["wide", 980, 230],
  ] as const)("banner %s card is %ix%i", (size: CardSize, width, height) => {
    expect(getCardDimensions(layout({ layoutStyle: "banner", size }))).toEqual({ width, height });
  });

  it("grows when more text lines are added", () => {
    const base = getCardDimensions(layout({ boostText: undefined, message: undefined }));
    const full = getCardDimensions(
      layout({ secondaryMessage: "Enjoy the perks", dateText: "today" }),
    );

    expect(full.height).toBeGreaterThan(base.height);
  });
});

describe("genBoosterPng", () => {
  it("renders a centered card matching its computed dimensions", async () => {
    const data = layout();
    const png = await genBoosterPng("", "Kira", data);

    expect(pngSize(png)).toEqual(getCardDimensions(data));
  });

  it("renders a banner card matching its computed dimensions", async () => {
    const data = layout({ layoutStyle: "banner" });
    const png = await genBoosterPng("", "Kira", data);

    expect(pngSize(png)).toEqual(getCardDimensions(data));
  });

  it("renders without the boost icon, kind label or boost text", async () => {
    const data = layout({ showBoostIcon: false, kindLabel: "", boostText: undefined });
    const png = await genBoosterPng("", "Kira", data);

    expect(pngSize(png)).toEqual(getCardDimensions(data));
  });
});
