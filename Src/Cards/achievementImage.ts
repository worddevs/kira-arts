import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genAchievementPng } from "../Utils/achievementCard.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { AchievementOptions, AchievementLayout } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export type { AchievementOptions } from "../@Types/index";

export async function achievementImage(
  userId: string,
  title: string,
  options: AchievementOptions = {},
): Promise<Buffer> {
  if (!userId || typeof userId !== "string") {
    throw new KiraError("A valid userId is required", KiraErrorCode.Validation);
  }

  if (!title || typeof title !== "string") {
    throw new KiraError("A valid title is required", KiraErrorCode.Validation);
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

  const layout: AchievementLayout = {
    title,
    description: options.description,
    iconUrl: options.iconUrl,
    rarity: options.rarity,
    accentColor,
    borderColors: borderColors.length ? borderColors : undefined,
    noBorder: options.removeBorder,
    customBackground: options.customBackground,
    usernameLine: options.showUsername === false ? undefined : username,
    progressText: options.progressText,
  };

  try {
    return await genAchievementPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
