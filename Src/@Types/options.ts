import type { PresenceStatus, BorderAlign, OutputOptions, ColorInput } from "./common";
import type { KiraThemeName } from "./theme";

export interface RankOptions {
  currentXp: number;
  requiredXp: number;
  level: number;
  rank?: number;
  barColor?: ColorInput;
  levelColor?: string;
  autoColorRank?: boolean;
}

export interface MemberEventOptions {
  message?: string;
  memberCount?: number;
  customBackground?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  accentColor?: string;
  usernameColor?: string;
  messageColor?: string;
  showDate?: boolean;
  date?: Date | string;
  localDateType?: string;
  guildId?: string;
  bypassCache?: boolean;
  fontScale?: number;
  showAvatarDecoration?: boolean;
  avatarBorderColor?: string;
  showServerTag?: boolean;
  showBadges?: boolean;
  maxBadges?: number;
  usernameEffect?: "shadow" | "glow";
  messageEffect?: "shadow" | "glow";
  glowColor?: string;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface AchievementOptions {
  description?: string;
  iconUrl?: string;
  rarity?: AchievementRarity;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  progressText?: string;
  showUsername?: boolean;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface ShipOptions {
  leftImage?: string;
  rightImage?: string;
  percentage?: number;
  message?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  heartColor?: string;
  shipName?: string;
  showText?: boolean;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface LevelUpOptions {
  message?: string;
  currentXp?: number;
  requiredXp?: number;
  customBackground?: string;
  backgroundTint?: boolean;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  accentColor?: string;
  barColor?: ColorInput;
  barBackgroundColor?: string;
  levelColor?: string;
  usernameColor?: string;
  messageColor?: string;
  kickerColor?: string;
  xpColor?: string;
  avatarBorderColor?: string;
  showAvatarDecoration?: boolean;
  showBadges?: boolean;
  maxBadges?: number;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface LeaderboardEntry {
  userId: string;
  currentXp: number;
  requiredXp: number;
  level: number;
  rank?: number;
}

export interface LeaderboardOptions {
  title?: string;
  subtitle?: string;
  barColor?: ColorInput;
  levelColor?: string;
  usernameColor?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  backgroundImage?: string;
  guildId?: string;
  bypassCache?: boolean;
  maxEntries?: number;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface AchievementLayout {
  title: string;
  description?: string;
  iconUrl?: string;
  rarity?: AchievementRarity;
  accentColor?: string;
  borderColors?: string[];
  noBorder?: boolean;
  customBackground?: string;
  usernameLine?: string;
  progressText?: string;
}

export interface ProfileOptions {
  customUsername?: string;
  customTag?: string;
  compactTag?: boolean;
  customSubtitle?: string;
  color?: string;
  useRoleColor?: boolean;
  guildId?: string;
  bypassCache?: boolean;
  customBadges?: string[];
  customBackground?: string;
  overwriteBadges?: boolean;
  usernameColor?: string;
  tagColor?: string;
  borderColor?: ColorInput;
  borderAllign?: BorderAlign;
  disableProfileTheme?: boolean;
  disableBackgroundBlur?: boolean;
  badgesFrame?: boolean;
  removeBadges?: boolean;
  removeBorder?: boolean;
  presenceStatus?: PresenceStatus;
  squareAvatar?: boolean;
  moreBackgroundBlur?: boolean;
  backgroundBrightness?: number;
  customDate?: Date | string;
  localDateType?: string;
  removeAvatarFrame?: boolean;
  removeNameplate?: boolean;
  removeServerTag?: boolean;
  rankData?: RankOptions;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface NowPlayingLayout {
  title: string;
  author?: string;
  artworkUrl?: string;
  duration?: number;
  position: number;
  isLive: boolean;
  paused: boolean;
  sourceLabel?: string;
  sourceIcon?: SourceIconKind;
  accentColor: string;
  borderColors: string[];
  barColors: string[];
  titleColor?: string;
  authorColor?: string;
  customBackground?: string;
  showSourceBadge: boolean;
  requester?: {
    username: string;
    avatarUrl: string;
  } | null;
}

export interface NowPlayingTrack {
  title: string;
  author?: string;
  artworkUrl?: string;
  duration?: number;
  isStream?: boolean;
  sourceName?: string;
}

export interface NowPlayingOptions {
  position?: number;
  paused?: boolean;
  requesterId?: string;
  guildId?: string;
  bypassCache?: boolean;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  progressBarColor?: ColorInput;
  titleColor?: string;
  authorColor?: string;
  showSourceBadge?: boolean;
  showRequestedBy?: boolean;
  customBackground?: string;
  customWidth?: number;
  customHeight?: number;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export type SourceIconKind = "play" | "waves" | "cloud" | "bolt" | "note";

export interface SourceMeta {
  label: string;
  color: string;
  icon: SourceIconKind;
}
