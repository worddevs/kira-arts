import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genLevelUpPng } from "../Utils/levelUpCard.output.utils";
import { parseHex } from "../Utils/validations.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { LevelUpLayout } from "../Utils/LevelUpCard/index";
import type { LevelUpOptions} from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export type { LevelUpOptions } from "../@Types/index";

const DEFAULT_ACCENT = "#FACC15";

export async function levelUpImage(
  userId: string,
  level: number,
  options: LevelUpOptions = {},
): Promise<Buffer> {
  if (!userId || typeof userId !== "string") {
    throw new KiraError("A valid userId is required", KiraErrorCode.Validation);
  }

  if (typeof level !== "number" || isNaN(level)) {
    throw new KiraError("A valid level is required", KiraErrorCode.Validation);
  }

  const data = await fetchUserData(userId, options.guildId, options.bypassCache);
  const username = data.basicInfo.globalName || data.basicInfo.username;
  const avatarUrl = data.assets.avatarURL ?? data.assets.defaultAvatarURL;

  const palette = getThemePalette(options.theme);

  const accentColor = options.accentColor
    ? parseHex(options.accentColor)
    : palette?.accentColor
      ? parseHex(palette.accentColor)
      : DEFAULT_ACCENT;

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder: options.removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: data.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: data.decoration.roleColor,
    fallback: palette?.borderColor ?? [accentColor],
  });

  const barColors = resolveCardColors({
    custom: options.barColor,
    fallback: palette?.barColor ?? [accentColor],
  });

  const showAvatarDecoration = options.showAvatarDecoration !== false;
  const avatarFrameUrl = showAvatarDecoration ? data.decoration.avatarFrame : null;
  const badges = options.showBadges ? data.assets.badges : undefined;

  const layout: LevelUpLayout = {
    username,
    avatarUrl,
    level,
    currentXp: options.currentXp,
    requiredXp: options.requiredXp,
    message: options.message,
    accentColor,
    borderColors,
    barColors,
    barBackgroundColor: options.barBackgroundColor,
    levelColor: options.levelColor ?? palette?.levelColor,
    usernameColor: options.usernameColor ?? palette?.usernameColor,
    messageColor: options.messageColor ?? palette?.messageColor,
    kickerColor: options.kickerColor,
    xpColor: options.xpColor,
    customBackground: options.customBackground,
    backgroundTint: options.backgroundTint,
    avatarBorderColor: options.avatarBorderColor,
    avatarFrameUrl,
    badges,
    maxBadges: options.maxBadges,
  };

  try {
    return await genLevelUpPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
