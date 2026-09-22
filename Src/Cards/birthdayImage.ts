import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genBirthdayPng } from "../Utils/birthdayCard.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { type BirthdayOptions, type BirthdayLayout, KiraErrorCode } from "../@Types/index";

export async function birthdayImage(
  userId: string,
  options: BirthdayOptions = {},
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

  const layout: BirthdayLayout = {
    username: options.showUsername === false ? "" : username,
    avatarUrl: data.assets.avatarURL ?? data.assets.defaultAvatarURL,
    age: options.age,
    yearsInServer: options.yearsInServer,
    message: options.customMessage,
    accentColor: accentColor ?? "#F472B6",
    borderColors,
    noBorder: options.removeBorder,
    customBackground: options.customBackground,
  };

  try {
    return await genBirthdayPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
