import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genLeaderboardPng } from "../Utils/leaderboardImage.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { ResolvedLeaderboardEntry} from "../Utils/LeaderboardImage/index";
import { DEFAULT_ACCENT } from "../Utils/LeaderboardImage/index";
import type { LeaderboardEntry, LeaderboardOptions} from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

const DEFAULT_MAX_ENTRIES = 5;
const HARD_MAX_ENTRIES = 15;

export async function leaderboardImage(
  entries: LeaderboardEntry[],
  options: LeaderboardOptions = {},
): Promise<Buffer> {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new KiraError(
      "leaderboardImage() expects a non-empty array of LeaderboardEntry",
      KiraErrorCode.Validation,
    );
  }

  const requestedMax = options.maxEntries ?? DEFAULT_MAX_ENTRIES;

  if (!Number.isFinite(requestedMax) || requestedMax < 1) {
    throw new KiraError(
      `Invalid maxEntries (${options.maxEntries}), must be a number between 1 and ${HARD_MAX_ENTRIES}`,
      KiraErrorCode.Validation,
    );
  }
  const maxEntries = Math.min(requestedMax, HARD_MAX_ENTRIES);

  const topEntries = entries.slice(0, maxEntries);

  for (const entry of topEntries) {
    if (!entry?.userId || typeof entry.userId !== "string") {
      throw new KiraError(
        "Every leaderboard entry requires a valid userId",
        KiraErrorCode.Validation,
      );
    }

    if (
      typeof entry.currentXp !== "number" ||
      typeof entry.requiredXp !== "number" ||
      typeof entry.level !== "number" ||
      !Number.isFinite(entry.currentXp) ||
      !Number.isFinite(entry.requiredXp) ||
      !Number.isFinite(entry.level)
    ) {
      throw new KiraError(
        `Invalid leaderboard entry for userId (${entry.userId}): currentXp, requiredXp and level are required numbers`,
        KiraErrorCode.Validation,
      );
    }
  }

  const resolvedEntries: ResolvedLeaderboardEntry[] = await Promise.all(
    topEntries.map(async (entry, index) => {
      const data = await fetchUserData(entry.userId, options.guildId, options.bypassCache);

      return {
        entry: { ...entry, rank: entry.rank ?? index + 1 },
        data,
      };
    }),
  );

  try {
    const palette = getThemePalette(options.theme);
    const accentColor = options.accentColor ?? palette?.accentColor ?? DEFAULT_ACCENT;
    const topEntryData = resolvedEntries[0]?.data;

    const borderColors = resolveCardColors({
      custom: options.borderColor,
      removeBorder: options.removeBorder,
      useNitroTheme: options.useNitroTheme,
      nitroColors: topEntryData?.decoration.profileColors,
      useRoleColor: options.useRoleColor,
      roleColor: topEntryData?.decoration.roleColor,
      fallback: palette?.borderColor ?? [accentColor],
    });

    const resolvedOptions: LeaderboardOptions = {
      ...options,
      accentColor,
      usernameColor: options.usernameColor ?? palette?.usernameColor,
      levelColor: options.levelColor ?? palette?.levelColor,
      barColor: options.barColor ?? palette?.barColor,
    };

    return await genLeaderboardPng(resolvedEntries, resolvedOptions, borderColors);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
