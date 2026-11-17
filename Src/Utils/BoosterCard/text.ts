import type { BoosterLevel } from "../../@Types/index";

export const DEFAULT_BOOSTER_MESSAGE = "Thanks for boosting {server}!";
export const DEFAULT_REPEAT_BOOSTER_MESSAGE = "Thanks for boosting {server} again!";

export interface BoosterTemplateValues {
  username: string;
  guildName: string;
  boostCount?: number;
  userBoostCount?: number;
}

/** A user counts as a repeat booster only from their second boost on. */
export function isRepeatBoost(userBoostCount?: number): boolean {
  return userBoostCount != null && userBoostCount > 1;
}

export function isLevelUp(previousLevel?: BoosterLevel, boostLevel?: BoosterLevel): boolean {
  return previousLevel != null && boostLevel != null && previousLevel < boostLevel;
}

export function formatMessage(template: string, values: BoosterTemplateValues): string {
  const { username, guildName, boostCount, userBoostCount } = values;

  return template
    .replace(/\{username\}/g, username)
    .replace(/\{user\}/g, username)
    .replace(/\{server\}/g, guildName)
    .replace(/\{boosts\}/g, boostCount != null ? String(boostCount) : "")
    .replace(/\{userBoosts\}/g, userBoostCount != null ? String(userBoostCount) : "");
}

export function formatKindLabel(localDateType: string, repeat: boolean): string {
  const isEs = localDateType.startsWith("es");

  if (repeat) return isEs ? "OTRO BOOST" : "BOOSTED AGAIN";

  return isEs ? "NUEVO BOOSTER" : "NEW BOOSTER";
}

export interface BoostTextValues {
  userBoostCount?: number;
  boostCount?: number;
  boostLevel?: BoosterLevel;
  previousLevel?: BoosterLevel;
}

/**
 * Builds the accent line under the message, e.g.
 * "Boost #2 · 14 boosts · Level 1 → 2". Returns `undefined` when there is
 * nothing to show.
 */
export function formatBoostText(
  values: BoostTextValues,
  localDateType: string,
): string | undefined {
  const { userBoostCount, boostCount, boostLevel, previousLevel } = values;
  const isEs = localDateType.startsWith("es");
  const levelWord = isEs ? "Nivel" : "Level";
  const parts: string[] = [];

  if (isRepeatBoost(userBoostCount)) {
    parts.push(`Boost #${userBoostCount}`);
  }

  if (boostCount != null) {
    parts.push(`${boostCount} boost${boostCount === 1 ? "" : "s"}`);
  }

  if (boostLevel != null) {
    parts.push(
      isLevelUp(previousLevel, boostLevel)
        ? `${levelWord} ${previousLevel} → ${boostLevel}`
        : `${levelWord} ${boostLevel}`,
    );
  }

  return parts.length ? parts.join(" · ") : undefined;
}
