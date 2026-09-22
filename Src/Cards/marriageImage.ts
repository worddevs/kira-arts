import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genMarriagePng } from "../Utils/marriageCard.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { getDateOrString } from "../Utils/strings.utils";
import { type MarriageOptions, type MarriageLayout, KiraErrorCode } from "../@Types/index";

function computeDaysTogether(marriedSince: Date | string | undefined): number | undefined {
  if (!marriedSince) return undefined;

  const date = marriedSince instanceof Date ? marriedSince : new Date(marriedSince);
  if (Number.isNaN(date.getTime())) return undefined;

  const diffMs = Date.now() - date.getTime();

  return Math.max(0, Math.floor(diffMs / 86400000));
}

export async function marriageImage(
  leftUserId: string,
  rightUserId: string,
  options: MarriageOptions = {},
): Promise<Buffer> {
  if (!leftUserId || typeof leftUserId !== "string") {
    throw new KiraError("A valid leftUserId is required", KiraErrorCode.Validation);
  }

  if (!rightUserId || typeof rightUserId !== "string") {
    throw new KiraError("A valid rightUserId is required", KiraErrorCode.Validation);
  }

  const bypassCache = options.bypassCache ?? false;

  const [leftData, rightData] = await Promise.all([
    fetchUserData(leftUserId, options.guildId, bypassCache),
    fetchUserData(rightUserId, options.guildId, bypassCache),
  ]);

  const palette = getThemePalette(options.theme);
  const accentColor = options.accentColor ?? palette?.accentColor;

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder: options.removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: leftData.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: leftData.decoration.roleColor,
    fallback: palette?.borderColor ?? (accentColor ? [accentColor] : undefined),
  });

  const layout: MarriageLayout = {
    leftUsername: leftData.basicInfo.globalName || leftData.basicInfo.username,
    rightUsername: rightData.basicInfo.globalName || rightData.basicInfo.username,
    leftAvatarUrl:
      options.leftImage ?? leftData.assets.avatarURL ?? leftData.assets.defaultAvatarURL,
    rightAvatarUrl:
      options.rightImage ?? rightData.assets.avatarURL ?? rightData.assets.defaultAvatarURL,
    dateText: options.marriedSince
      ? getDateOrString(options.marriedSince, Date.now(), options.localDateType)
      : undefined,
    daysTogether: computeDaysTogether(options.marriedSince),
    vows: options.vows,
    accentColor: accentColor ?? "#D4AF37",
    borderColors,
    noBorder: options.removeBorder,
    customBackground: options.customBackground,
  };

  try {
    return await genMarriagePng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
