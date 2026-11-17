import { describe, expect, it } from "vitest";

import { formatBoostText, formatKindLabel, formatMessage, isLevelUp, isRepeatBoost } from "./text";

describe("isRepeatBoost", () => {
  it("is false without a count or for the first boost", () => {
    expect(isRepeatBoost(undefined)).toBe(false);
    expect(isRepeatBoost(1)).toBe(false);
  });

  it("is true from the second boost", () => {
    expect(isRepeatBoost(2)).toBe(true);
    expect(isRepeatBoost(5)).toBe(true);
  });
});

describe("isLevelUp", () => {
  it("only when the level actually increased", () => {
    expect(isLevelUp(1, 2)).toBe(true);
    expect(isLevelUp(2, 2)).toBe(false);
    expect(isLevelUp(undefined, 2)).toBe(false);
    expect(isLevelUp(1, undefined)).toBe(false);
  });
});

describe("formatKindLabel", () => {
  it("uses the new booster label by default", () => {
    expect(formatKindLabel("en", false)).toBe("NEW BOOSTER");
    expect(formatKindLabel("es", false)).toBe("NUEVO BOOSTER");
  });

  it("uses the repeat label for repeat boosts", () => {
    expect(formatKindLabel("en", true)).toBe("BOOSTED AGAIN");
    expect(formatKindLabel("es-ES", true)).toBe("OTRO BOOST");
  });
});

describe("formatBoostText", () => {
  it("returns undefined when there is nothing to show", () => {
    expect(formatBoostText({}, "en")).toBeUndefined();
  });

  it("keeps the first boost card unchanged", () => {
    expect(formatBoostText({ userBoostCount: 1, boostCount: 14, boostLevel: 3 }, "en")).toBe(
      "14 boosts · Level 3",
    );
  });

  it("uses the singular for one boost", () => {
    expect(formatBoostText({ boostCount: 1 }, "en")).toBe("1 boost");
  });

  it("adds the user's boost number from the second boost", () => {
    expect(formatBoostText({ userBoostCount: 2, boostCount: 14, boostLevel: 3 }, "en")).toBe(
      "Boost #2 · 14 boosts · Level 3",
    );
  });

  it("shows the level jump when the server leveled up", () => {
    expect(formatBoostText({ boostCount: 7, boostLevel: 2, previousLevel: 1 }, "en")).toBe(
      "7 boosts · Level 1 → 2",
    );
  });

  it("does not show an arrow when the level did not change", () => {
    expect(formatBoostText({ boostLevel: 2, previousLevel: 2 }, "en")).toBe("Level 2");
  });

  it("translates the level word to Spanish", () => {
    expect(
      formatBoostText({ userBoostCount: 3, boostCount: 9, boostLevel: 2, previousLevel: 1 }, "es"),
    ).toBe("Boost #3 · 9 boosts · Nivel 1 → 2");
  });
});

describe("formatMessage", () => {
  it("replaces every variable", () => {
    expect(
      formatMessage("{username}/{user} in {server}: {boosts} total, {userBoosts} yours", {
        username: "Zzzz",
        guildName: "Word Devs",
        boostCount: 11,
        userBoostCount: 2,
      }),
    ).toBe("Zzzz/Zzzz in Word Devs: 11 total, 2 yours");
  });

  it("leaves count variables empty when they are not provided", () => {
    expect(formatMessage("[{boosts}][{userBoosts}]", { username: "A", guildName: "B" })).toBe(
      "[][]",
    );
  });
});
