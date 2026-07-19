import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genMemberEventPng } from "../Utils/memberEventCard.output.utils";
import { parseHex } from "../Utils/validations.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getDateOrString } from "../Utils/strings.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { MemberEventLayout } from "../Utils/MemberEeventCard/index";
import type { MemberEventOptions} from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

const DEFAULT_ACCENT = "#2DD4BF";

function formatMessage(
  template: string,
  username: string,
  guildName: string,
  memberCount?: number,
): string {
  return template
    .replace(/\{username\}/g, username)
    .replace(/\{user\}/g, username)
    .replace(/\{server\}/g, guildName)
    .replace(/\{memberCount\}/g, memberCount != null ? String(memberCount) : "");
}

export async function renderMemberEventCard(
  userId: string,
  guildName: string,
  defaultMessage: string,
  options: MemberEventOptions = {},
): Promise<Buffer> {
  if (!userId || typeof userId !== "string") {
    throw new KiraError("A valid userId is required", KiraErrorCode.Validation);
  }

  if (!guildName || typeof guildName !== "string") {
    throw new KiraError("A valid guildName is required", KiraErrorCode.Validation);
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

  const rawMessage = options.message ?? defaultMessage;
  const message = formatMessage(rawMessage, username, guildName, options.memberCount);

  const dateText = options.showDate
    ? getDateOrString(options.date, Date.now(), options.localDateType ?? "es")
    : undefined;

  const fontScale = options.fontScale && options.fontScale > 0 ? options.fontScale : 1;
  const avatarFrameUrl = options.showAvatarDecoration ? data.decoration.avatarFrame : null;
  const serverTag = options.showServerTag ? data.decoration.serverTag : null;
  const badges = options.showBadges ? data.assets.badges : undefined;

  const layout: MemberEventLayout = {
    message,
    memberCount: options.memberCount,
    dateText,
    accentColor,
    borderColors,
    usernameColor: options.usernameColor ?? palette?.usernameColor,
    messageColor: options.messageColor ?? palette?.messageColor,
    customBackground: options.customBackground,
    fontScale,
    avatarFrameUrl,
    avatarBorderColor: options.avatarBorderColor,
    serverTag,
    badges,
    maxBadges: options.maxBadges,
    usernameEffect: options.usernameEffect,
    messageEffect: options.messageEffect,
    glowColor: options.glowColor ?? palette?.glowColor,
  };

  try {
    return await genMemberEventPng(avatarUrl, username, layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
