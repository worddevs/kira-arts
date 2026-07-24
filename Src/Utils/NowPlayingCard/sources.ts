import type { SourceMeta } from "../../@Types/index";

const SOURCE_MAP: Record<string, SourceMeta> = {
  youtube: { label: "YouTube", color: "#FF0000", icon: "play" },
  youtubemusic: { label: "YouTube Music", color: "#FF0000", icon: "play" },
  spotify: { label: "Spotify", color: "#1DB954", icon: "waves" },
  soundcloud: { label: "SoundCloud", color: "#FF5500", icon: "cloud" },
  twitch: { label: "Twitch", color: "#9146FF", icon: "bolt" },
  deezer: { label: "Deezer", color: "#A238FF", icon: "waves" },
  applemusic: { label: "Apple Music", color: "#FA2D48", icon: "note" },
  bandcamp: { label: "Bandcamp", color: "#629AA9", icon: "note" },
  vimeo: { label: "Vimeo", color: "#1AB7EA", icon: "play" },
  http: { label: "Direct Link", color: "#8A8F98", icon: "note" },
  local: { label: "Local File", color: "#8A8F98", icon: "note" },
};

const DEFAULT_SOURCE: SourceMeta = { label: "Unknown", color: "#8A8F98", icon: "note" };

export function resolveSourceMeta(sourceName?: string): SourceMeta {
  if (!sourceName) return DEFAULT_SOURCE;

  const key = sourceName.toLowerCase().replace(/[\s_-]/g, "");

  return SOURCE_MAP[key] ?? { label: sourceName, color: DEFAULT_SOURCE.color, icon: "note" };
}
