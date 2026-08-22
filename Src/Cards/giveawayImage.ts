import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genGiveawayPng } from "../Utils/giveawayCard.output.utils";
import { parseHex } from "../Utils/validations.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { formatGiveawayEndText } from "../Utils/strings.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { MAX_WINNERS_SHOWN, DEFAULT_ACCENT } from "../Utils/GiveawayCard/constants";
import type { GiveawayLayout, GiveawayOptions, GiveawayWinner } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export type { GiveawayOptions } from "../@Types/index";

export async function giveawayImage(prize: string, options: GiveawayOptions = {}): Promise<Buffer> {
  if (!prize || typeof prize !== "string") {
    throw new KiraError("A valid prize is required", KiraErrorCode.Validation);
  }

  const bypassCache = options.bypassCache ?? false;
  const status = options.status ?? "active";

  const hostData = options.hostId
    ? await fetchUserData(options.hostId, options.guildId, bypassCache)
    : undefined;

  const hostName =
    options.hostName ?? hostData?.basicInfo.globalName ?? hostData?.basicInfo.username;
  const hostAvatarUrl =
    options.hostAvatar ?? hostData?.assets.avatarURL ?? hostData?.assets.defaultAvatarURL;

  const winnerIds = options.winnerIds?.slice(0, MAX_WINNERS_SHOWN) ?? [];
  const winnerDataList = await Promise.all(
    winnerIds.map((winnerId) => fetchUserData(winnerId, options.guildId, bypassCache)),
  );

  const winners: GiveawayWinner[] = winnerDataList.map((data) => ({
    username: data.basicInfo.globalName || data.basicInfo.username,
    avatarUrl: data.assets.avatarURL ?? data.assets.defaultAvatarURL,
  }));

  const winnersCount = options.winnersCount ?? (winnerIds.length > 0 ? winnerIds.length : 1);

  const palette = getThemePalette(options.theme);
  const accentColor = options.accentColor
    ? parseHex(options.accentColor)
    : (palette?.accentColor ?? DEFAULT_ACCENT);

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder: options.removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: hostData?.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: hostData?.decoration.roleColor,
    fallback: palette?.borderColor ?? [accentColor],
  });

  const dateText =
    status === "ended"
      ? (options.endedText ?? "Sorteo finalizado")
      : options.endsAt
        ? formatGiveawayEndText(options.endsAt, Date.now(), options.localDateType ?? "es")
        : undefined;

  const layout: GiveawayLayout = {
    prize,
    description: options.description,
    status,
    winnersCount,
    hostName,
    hostAvatarUrl,
    winners: winners.length > 0 ? winners : undefined,
    dateText,
    accentColor,
    borderColors,
    customBackground: options.customBackground,
    prizeColor: options.prizeColor,
    hostColor: options.hostColor,
    participantsCount: options.participantsCount,
  };

  try {
    return await genGiveawayPng(layout, options.output);
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
