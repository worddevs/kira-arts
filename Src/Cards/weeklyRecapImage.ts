import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genWeeklyRecapPng } from "../Utils/weeklyRecapCard.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { DAY_LABELS } from "../Utils/WeeklyRecapCard/constants";
import { type WeeklyRecapOptions, type WeeklyRecapLayout, KiraErrorCode } from "../@Types/index";

export async function weeklyRecapImage(
  userId: string,
  options: WeeklyRecapOptions = {},
): Promise<Buffer> {
  if (!userId || typeof userId !== "string") {
    throw new KiraError("A valid userId is required", KiraErrorCode.Validation);
  }

  const data = await fetchUserData(userId, options.guildId, options.bypassCache);

  const username = data.basicInfo.globalName || data.basicInfo.username;

  const palette = getThemePalette(options.theme);
  const accentColor = options.accentColor ?? palette?.accentColor;

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder: options.removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: data.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: data.decoration.roleColor,
    fallback: palette?.borderColor,
  });

  const dailyActivity =
    options.dailyActivity && options.dailyActivity.length > 0
      ? options.dailyActivity
      : DAY_LABELS.map((label) => ({ label, value: 0 }));

  const layout: WeeklyRecapLayout = {
    username,
    avatarUrl: data.assets.avatarURL ?? data.assets.defaultAvatarURL,
    messagesSent: options.messagesSent,
    voiceMinutes: options.voiceMinutes,
    xpGained: options.xpGained,
    currentStreak: options.currentStreak,
    rankChange: options.rankChange,
    mostActiveDay: options.mostActiveDay,
    dailyActivity,
    guildName: options.guildName,
    accentColor: accentColor ?? "#818CF8",
    borderColors,
    noBorder: options.removeBorder,
    customBackground: options.customBackground,
  };

  try {
    return await genWeeklyRecapPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
