import { parseDurationString } from "../Utils/strings.utils";
import type { NowPlayingTrack } from "../@Types/index";
import type {
  MoonlinkTrackLike,
  LavalinkTrackLike,
  DiscordPlayerTrackLike,
  DistubeSongLike,
} from "../@Types/index";

function extractId(value: { id?: string } | string | undefined): string | undefined {
  if (!value) return undefined;

  return typeof value === "string" ? value : value.id;
}

export function fromMoonlinkTrack(track: MoonlinkTrackLike): NowPlayingTrack {
  return {
    title: track.title,
    author: track.author,
    artworkUrl: track.artworkUrl ?? track.thumbnail,
    duration: track.duration,
    isStream: track.isStream,
    sourceName: track.sourceName,
  };
}

export function fromLavalinkTrack(track: LavalinkTrackLike): NowPlayingTrack {
  const info = track.info ?? track;

  return {
    title: info.title ?? "Unknown title",
    author: info.author,
    artworkUrl: info.artworkUrl ?? info.thumbnail,
    duration: info.length ?? info.duration,
    isStream: info.isStream,
    sourceName: info.sourceName,
  };
}

export function fromDiscordPlayerTrack(track: DiscordPlayerTrackLike): NowPlayingTrack {
  const duration =
    typeof track.durationMS === "number" ? track.durationMS : parseDurationString(track.duration);

  return {
    title: track.title,
    author: track.author,
    artworkUrl: track.thumbnail,
    duration,
    isStream: track.live ?? duration === undefined,
    sourceName: track.source,
  };
}

export function fromDistubeTrack(song: DistubeSongLike): NowPlayingTrack {
  return {
    title: song.name ?? "Unknown title",
    author: song.uploader?.name,
    artworkUrl: song.thumbnail,
    duration: typeof song.duration === "number" ? song.duration * 1000 : undefined,
    isStream: song.isLive,
    sourceName: song.source,
  };
}

export function extractRequesterId(
  track: MoonlinkTrackLike | LavalinkTrackLike | DiscordPlayerTrackLike | DistubeSongLike,
): string | undefined {
  const candidate =
    (track as MoonlinkTrackLike | DiscordPlayerTrackLike).requestedBy ??
    (track as LavalinkTrackLike).requester ??
    (track as DistubeSongLike).user;

  return extractId(candidate);
}
