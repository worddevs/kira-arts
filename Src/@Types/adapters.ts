export interface MoonlinkTrackLike {
  title: string;
  author?: string;
  duration?: number;
  artworkUrl?: string;
  thumbnail?: string;
  sourceName?: string;
  isStream?: boolean;
  requestedBy?: { id?: string } | string;
  requester?: { id?: string } | string;
}

export interface LavalinkTrackLike {
  title?: string;
  author?: string;
  duration?: number;
  length?: number;
  thumbnail?: string;
  artworkUrl?: string;
  isStream?: boolean;
  sourceName?: string;
  requester?: { id?: string } | string;
  info?: {
    title?: string;
    author?: string;
    length?: number;
    duration?: number;
    artworkUrl?: string;
    thumbnail?: string;
    isStream?: boolean;
    sourceName?: string;
  };
}

export interface DiscordPlayerTrackLike {
  title: string;
  author?: string;
  thumbnail?: string;
  duration?: string;
  durationMS?: number;
  source?: string;
  live?: boolean;
  requestedBy?: { id?: string } | string;
}

export interface DistubeSongLike {
  name?: string;
  uploader?: { name?: string };
  thumbnail?: string;
  duration?: number;
  isLive?: boolean;
  source?: string;
  user?: { id?: string } | string;
}
