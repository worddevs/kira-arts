import type { KiraNameplatePalette } from "./theme";
import type { LeaderboardEntry } from "./options";

export interface KiraBadge {
  name: string;
  icon: string;
}

export interface KiraNameplate {
  imageURL: string;
  palette: KiraNameplatePalette;
}

export interface KiraServerTag {
  text: string;
  badgeURL: string | null;
}

export interface KiraUserBasicInfo {
  id: string;
  username: string;
  globalName: string | null;
  discriminator: string | null;
  bot: boolean;
  verified: boolean;
  createdTimestamp: number;
}

export interface KiraUserAssets {
  avatarURL: string | null;
  defaultAvatarURL: string;
  bannerURL: string | null;
  badges: KiraBadge[];
}

export interface KiraUserDecoration {
  avatarFrame: string | null;
  profileColors: string[] | null;
  roleColor: string | null;
  nameplate: KiraNameplate | null;
  serverTag: KiraServerTag | null;
}

export interface KiraUserData {
  basicInfo: KiraUserBasicInfo;
  assets: KiraUserAssets;
  decoration: KiraUserDecoration;
}

export interface RawUserProfileResponse {
  theme_colors?: number[];
  user_profile_customization?: {
    theme_colors?: number[];
  };
}

export interface ParsedUsername {
  username: string;
  newSize: number;
  textLength: number;
}

export interface CacheEntry {
  data: KiraUserData;
  expiresAt: number;
}

export interface KiraMemberInfo {
  boostBadge: KiraBadge | null;
  roleColor: string | null;
}

export interface ShipLayout {
  leftAvatarUrl: string;
  rightAvatarUrl: string;
  percentage: number;
  message: string;
  accentColor?: string;
  borderColors?: string[];
  noBorder?: boolean;
  customBackground?: string;
  heartColor?: string;
  shipName?: string;
  showText?: boolean;
}

export type TextEffect = "none" | "shadow" | "glow";

export interface MemberEventLayout {
  message?: string;
  memberCount?: number;
  dateText?: string;
  accentColor: string;
  borderColors: string[];
  usernameColor?: string;
  messageColor?: string;
  customBackground?: string;
  fontScale?: number;
  avatarFrameUrl?: string | null;
  avatarBorderColor?: string;
  serverTag?: KiraServerTag | null;
  badges?: KiraBadge[];
  maxBadges?: number;
  usernameEffect?: TextEffect;
  messageEffect?: TextEffect;
  glowColor?: string;
}

export interface ResolvedLeaderboardEntry {
  entry: LeaderboardEntry & { rank: number };
  data: KiraUserData;
}
