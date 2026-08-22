import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genNowPlayingPng } from "../Utils/nowPlayingCard.output.utils";
import { resolveCardColors } from "../Utils/canvasShared.utils";
import { getThemePalette } from "../Utils/themes.utils";
import { resolveSourceMeta } from "../Utils/NowPlayingCard/index";
import type { NowPlayingTrack, NowPlayingOptions, NowPlayingLayout } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export type { NowPlayingTrack, NowPlayingOptions } from "../@Types/index";

const DEFAULT_ACCENT = "#1DB954";

export async function nowPlayingImage(
  track: NowPlayingTrack,
  options: NowPlayingOptions = {},
): Promise<Buffer> {
  if (!track || typeof track.title !== "string" || !track.title.trim()) {
    throw new KiraError("A track with a valid title is required", KiraErrorCode.Validation);
  }

  const bypassCache = options.bypassCache ?? false;
  const position = Math.max(0, options.position ?? 0);
  const isLive = Boolean(track.isStream) || !track.duration || track.duration <= 0;
  const sourceMeta = resolveSourceMeta(track.sourceName);

  const palette = getThemePalette(options.theme);
  const accentColor =
    options.accentColor ?? palette?.accentColor ?? sourceMeta.color ?? DEFAULT_ACCENT;

  const needsRequesterData = Boolean(
    options.requesterId &&
    (options.useNitroTheme || options.useRoleColor || options.showRequestedBy !== false),
  );

  const requesterData = needsRequesterData
    ? await fetchUserData(options.requesterId!, options.guildId, bypassCache)
    : undefined;

  const hasExplicitBorderIntent = Boolean(
    options.borderColor ||
    options.theme ||
    options.useNitroTheme ||
    options.useRoleColor ||
    options.removeBorder === false,
  );
  const removeBorder = options.removeBorder ?? !hasExplicitBorderIntent;

  const borderColors = resolveCardColors({
    custom: options.borderColor,
    removeBorder,
    useNitroTheme: options.useNitroTheme,
    nitroColors: requesterData?.decoration.profileColors,
    useRoleColor: options.useRoleColor,
    roleColor: requesterData?.decoration.roleColor,
    fallback: palette?.borderColor ?? [accentColor],
  });

  const barColors = resolveCardColors({
    custom: options.progressBarColor,
    fallback: palette?.barColor ?? [accentColor],
  });

  const showRequestedBy = options.showRequestedBy !== false && Boolean(options.requesterId);

  const layout: NowPlayingLayout = {
    title: track.title,
    author: track.author,
    artworkUrl: track.artworkUrl,
    duration: track.duration,
    position,
    isLive,
    paused: Boolean(options.paused),
    sourceLabel: sourceMeta.label,
    sourceIcon: sourceMeta.icon,
    accentColor,
    borderColors,
    barColors,
    titleColor: options.titleColor ?? palette?.usernameColor,
    authorColor: options.authorColor ?? palette?.tagColor,
    customBackground: options.customBackground,
    showSourceBadge: options.showSourceBadge !== false,
    requester:
      showRequestedBy && requesterData
        ? {
            username: requesterData.basicInfo.globalName || requesterData.basicInfo.username,
            avatarUrl: requesterData.assets.avatarURL ?? requesterData.assets.defaultAvatarURL,
          }
        : null,
  };

  try {
    return await genNowPlayingPng(
      layout,
      options.customWidth,
      options.customHeight,
      options.output,
    );
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
