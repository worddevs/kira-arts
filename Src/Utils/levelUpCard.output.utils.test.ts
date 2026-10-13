import { describe, expect, it } from "vitest";

import { genLevelUpPng } from "./levelUpCard.output.utils";
import type { CardSize, LevelUpLayout } from "../@Types/index";

function pngSize(buffer: Buffer): { width: number; height: number } {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function layout(size?: CardSize): LevelUpLayout {
  return {
    size,
    username: "Kira",
    avatarUrl: "",
    level: 12,
    currentXp: 340,
    requiredXp: 1000,
    message: "Keep it up!",
    accentColor: "#FACC15",
    borderColors: ["#FACC15"],
    barColors: ["#FACC15"],
  };
}

describe("genLevelUpPng size", () => {
  it.each([
    [undefined, 700, 260],
    ["standard", 700, 260],
    ["compact", 560, 208],
    ["wide", 840, 312],
  ] as const)("renders size %s as %ix%i", async (size, width, height) => {
    const png = await genLevelUpPng(layout(size));

    expect(pngSize(png)).toEqual({ width, height });
  });
});
