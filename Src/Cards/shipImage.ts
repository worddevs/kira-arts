import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genShipPng } from "../Utils/shipCard.output.utils";
import { parseImg } from "../Utils/validations.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { ShipLayout } from "../Utils/ShipCard/index";
import { computeCompatibility, pickShipMessage } from "../Utils/ShipCard/index";
import type { ShipOptions } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export type { ShipOptions } from "../@Types/index";

async function resolveAvatarUrl(
  userId: string,
  override: string | undefined,
  guildId: string | undefined,
  bypassCache: boolean,
): Promise<string> {
  if (override) return parseImg(override);

  const data = await fetchUserData(userId, guildId, bypassCache);

  return data.assets.avatarURL ?? data.assets.defaultAvatarURL;
}

export async function shipImage(
  leftUserId: string,
  rightUserId: string,
  options: ShipOptions = {},
): Promise<Buffer> {
  if (!leftUserId || typeof leftUserId !== "string") {
    throw new KiraError("A valid leftUserId is required", KiraErrorCode.Validation);
  }

  if (!rightUserId || typeof rightUserId !== "string") {
    throw new KiraError("A valid rightUserId is required", KiraErrorCode.Validation);
  }

  const bypassCache = options.bypassCache ?? false;

  const [leftAvatarUrl, rightAvatarUrl] = await Promise.all([
    resolveAvatarUrl(leftUserId, options.leftImage, options.guildId, bypassCache),
    resolveAvatarUrl(rightUserId, options.rightImage, options.guildId, bypassCache),
  ]);

  const percentage =
    typeof options.percentage === "number"
      ? Math.min(100, Math.max(0, Math.round(options.percentage)))
      : computeCompatibility(leftUserId, rightUserId);

  const message = options.message ?? pickShipMessage(leftUserId, rightUserId, percentage);

  const palette = getThemePalette(options.theme);
  const accentColor = options.accentColor ?? palette?.accentColor;

  const needsDecoration = Boolean(options.useNitroTheme || options.useRoleColor);
  const leftData = needsDecoration
    ? await fetchUserData(leftUserId, options.guildId, bypassCache)
    : undefined;

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder: options.removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: leftData?.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: leftData?.decoration.roleColor,
    fallback: palette?.borderColor ?? (accentColor ? [accentColor] : undefined),
  });

  const layout: ShipLayout = {
    leftAvatarUrl,
    rightAvatarUrl,
    percentage,
    message,
    accentColor,
    borderColors: borderColors.length ? borderColors : undefined,
    noBorder: options.removeBorder,
    customBackground: options.customBackground,
    heartColor: options.heartColor ?? palette?.heartColor,
    shipName: options.shipName,
    showText: options.showText,
  };

  try {
    return await genShipPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
