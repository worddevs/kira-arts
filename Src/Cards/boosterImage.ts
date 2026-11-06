import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genBoosterPng } from "../Utils/boosterCard.output.utils";
import { parseHex } from "../Utils/validations.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getDateOrString, normalizeDisplayText } from "../Utils/strings.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { DEFAULT_ACCENT } from "../Utils/BoosterCard/constants";
import { type BoosterLayout, type BoosterOptions, KiraErrorCode } from "../@Types/index";

const DEFAULT_BOOSTER_MESSAGE = "Thanks for boosting {server}!";

function formatMessage(
  template: string,
  username: string,
  guildName: string,
  boostCount?: number,
): string {
  return template
    .replace(/\{username\}/g, username)
    .replace(/\{user\}/g, username)
    .replace(/\{server\}/g, guildName)
    .replace(/\{boosts\}/g, boostCount != null ? String(boostCount) : "");
}

function formatKindLabel(localDateType: string): string {
  return localDateType.startsWith("es") ? "NUEVO BOOSTER" : "NEW BOOSTER";
}

function formatBoostText(
  boostCount: number | undefined,
  boostLevel: number | undefined,
  localDateType: string,
): string | undefined {
  const isEs = localDateType.startsWith("es");
  const parts: string[] = [];

  if (boostCount != null) {
    parts.push(`${boostCount} boost${boostCount === 1 ? "" : "s"}`);
  }

  if (boostLevel != null) {
    parts.push(isEs ? `Nivel ${boostLevel}` : `Level ${boostLevel}`);
  }

  return parts.length ? parts.join(" · ") : undefined;
}

export async function boosterImage(
  userId: string,
  guildName: string,
  options: BoosterOptions = {},
): Promise<Buffer> {
  if (!userId || typeof userId !== "string") {
    throw new KiraError("A valid userId is required", KiraErrorCode.Validation);
  }

  if (!guildName || typeof guildName !== "string") {
    throw new KiraError("A valid guildName is required", KiraErrorCode.Validation);
  }

  if (
    options.boostCount != null &&
    (!Number.isInteger(options.boostCount) || options.boostCount < 0)
  ) {
    throw new KiraError("boostCount must be a non-negative integer", KiraErrorCode.Validation);
  }

  if (options.boostLevel != null && ![0, 1, 2, 3].includes(options.boostLevel)) {
    throw new KiraError("boostLevel must be 0, 1, 2 or 3", KiraErrorCode.Validation);
  }

  const data = await fetchUserData(userId, options.guildId, options.bypassCache);
  const username = normalizeDisplayText(data.basicInfo.globalName || data.basicInfo.username);
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

  const localDateType = options.localDateType ?? "en";
  const safeGuildName = normalizeDisplayText(guildName);
  const rawMessage =
    options.message === "" ? undefined : (options.message ?? DEFAULT_BOOSTER_MESSAGE);
  const message = rawMessage
    ? normalizeDisplayText(formatMessage(rawMessage, username, safeGuildName, options.boostCount))
    : undefined;

  const secondaryMessage = options.secondaryMessage
    ? normalizeDisplayText(
        formatMessage(options.secondaryMessage, username, safeGuildName, options.boostCount),
      )
    : undefined;

  const dateText = options.showDate
    ? getDateOrString(options.date, Date.now(), localDateType)
    : undefined;

  const fontScale = options.fontScale && options.fontScale > 0 ? options.fontScale : 1;

  const layout: BoosterLayout = {
    kindLabel: options.showKindLabel === false ? "" : formatKindLabel(localDateType),
    message,
    secondaryMessage,
    boostCount: options.boostCount,
    boostText: formatBoostText(options.boostCount, options.boostLevel, localDateType),
    boostLevel: options.boostLevel,
    dateText,
    accentColor,
    borderColors,
    borderMix: options.borderMix,
    usernameColor: options.usernameColor ?? palette?.usernameColor,
    messageColor: options.messageColor ?? palette?.messageColor,
    secondaryMessageColor: options.secondaryMessageColor,
    fontFamily: options.fontFamily,
    customBackground: options.customBackground,
    fontScale,
    layoutStyle: options.layout ?? "centered",
    size: options.size ?? "standard",
    animated: options.animated ?? false,
    confetti: options.confetti ?? false,
    gifSeconds: options.gifSeconds,
    avatarFrameUrl: options.showAvatarDecoration ? data.decoration.avatarFrame : null,
    avatarBorderColor: options.avatarBorderColor,
    serverTag: options.showServerTag ? data.decoration.serverTag : null,
    badges: options.showBadges ? data.assets.badges : undefined,
    maxBadges: options.maxBadges,
    showBoostIcon: options.showBoostIcon ?? true,
    usernameEffect: options.usernameEffect,
    messageEffect: options.messageEffect,
    glowColor: options.glowColor ?? palette?.glowColor,
  };

  try {
    return await genBoosterPng(avatarUrl, username, layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const errorMessage = error instanceof Error ? error.message : String(error);

    throw new KiraError(errorMessage, KiraErrorCode.Render);
  }
}
