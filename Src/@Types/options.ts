import type {
  PresenceStatus,
  BorderAlign,
  OutputOptions,
  ColorInput,
  KiraFontFamily,
} from "./common";
import type { KiraThemeName } from "./theme";
import type { KiraBadge } from "./user";

export interface RankOptions {
  currentXp: number;
  requiredXp: number;
  level: number;
  rank?: number;
  barColor?: ColorInput;
  levelColor?: string;
  autoColorRank?: boolean;
}

export type MemberEventLayoutStyle = "centered" | "banner";
export type CardSize = "compact" | "standard" | "wide";

/** @deprecated Use {@link CardSize}. Kept as an alias for backwards compatibility. */
export type MemberEventSize = CardSize;

export interface MemberEventOptions {
  message?: string;
  secondaryMessage?: string;
  memberCount?: number;
  customBackground?: string;
  layout?: MemberEventLayoutStyle;
  size?: MemberEventSize;
  animated?: boolean;
  confetti?: boolean;
  gifSeconds?: number;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  accentColor?: string;
  usernameColor?: string;
  messageColor?: string;
  secondaryMessageColor?: string;
  fontFamily?: KiraFontFamily;
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
  size?: CardSize;
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

export interface LevelUpLayout {
  size?: CardSize;
  username: string;
  avatarUrl: string;
  level: number;
  currentXp?: number;
  requiredXp?: number;
  message?: string;
  accentColor: string;
  borderColors: string[];
  barColors: string[];
  barBackgroundColor?: string;
  levelColor?: string;
  usernameColor?: string;
  messageColor?: string;
  kickerColor?: string;
  xpColor?: string;
  customBackground?: string;
  backgroundTint?: boolean;
  avatarBorderColor?: string;
  avatarFrameUrl?: string | null;
  badges?: KiraBadge[];
  maxBadges?: number;
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

export type GiveawayStatus = "active" | "ended";

export interface GiveawayWinner {
  username: string;
  avatarUrl: string;
}

export interface GiveawayOptions {
  hostId?: string;
  hostName?: string;
  hostAvatar?: string;
  winnersCount?: number;
  winnerIds?: string[];
  status?: GiveawayStatus;
  endsAt?: Date | string;
  endedText?: string;
  description?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  prizeColor?: string;
  hostColor?: string;
  guildId?: string;
  bypassCache?: boolean;
  localDateType?: string;
  theme?: KiraThemeName;
  output?: OutputOptions;
  participantsCount?: number;
}

export interface GiveawayLayout {
  prize: string;
  description?: string;
  status: GiveawayStatus;
  winnersCount: number;
  hostName?: string;
  hostAvatarUrl?: string;
  winners?: GiveawayWinner[];
  dateText?: string;
  accentColor: string;
  borderColors: string[];
  customBackground?: string;
  prizeColor?: string;
  hostColor?: string;
  participantsCount?: number;
}

export interface BirthdayOptions {
  age?: number;
  yearsInServer?: number;
  customMessage?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  showUsername?: boolean;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface BirthdayLayout {
  username: string;
  avatarUrl: string;
  age?: number;
  yearsInServer?: number;
  message?: string;
  accentColor: string;
  borderColors: string[];
  noBorder?: boolean;
  customBackground?: string;
}

export interface MarriageOptions {
  leftImage?: string;
  rightImage?: string;
  marriedSince?: Date | string;
  vows?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  localDateType?: string;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface MarriageLayout {
  leftUsername: string;
  rightUsername: string;
  leftAvatarUrl: string;
  rightAvatarUrl: string;
  dateText?: string;
  daysTogether?: number;
  vows?: string;
  accentColor: string;
  borderColors: string[];
  noBorder?: boolean;
  customBackground?: string;
}

export interface WeeklyRecapDayStat {
  label: string;
  value: number;
}

export interface WeeklyRecapOptions {
  messagesSent?: number;
  voiceMinutes?: number;
  xpGained?: number;
  currentStreak?: number;
  rankChange?: number;
  mostActiveDay?: string;
  dailyActivity?: WeeklyRecapDayStat[];
  guildName?: string;
  accentColor?: string;
  borderColor?: ColorInput;
  removeBorder?: boolean;
  useNitroTheme?: boolean;
  useRoleColor?: boolean;
  customBackground?: string;
  guildId?: string;
  bypassCache?: boolean;
  theme?: KiraThemeName;
  output?: OutputOptions;
}

export interface WeeklyRecapLayout {
  username: string;
  avatarUrl: string;
  messagesSent?: number;
  voiceMinutes?: number;
  xpGained?: number;
  currentStreak?: number;
  rankChange?: number;
  mostActiveDay?: string;
  dailyActivity: WeeklyRecapDayStat[];
  guildName?: string;
  accentColor: string;
  borderColors: string[];
  noBorder?: boolean;
  customBackground?: string;
}

export type CodeSnippetLanguage =
  "javascript" | "typescript" | "python" | "java" | "csharp" | "json" | "bash" | "plaintext";

export type CodeSnippetTheme = "midnight" | "dracula" | "nord" | "github" | "monokai" | "synthwave";

export interface CodeSnippetOptions {
  language?: CodeSnippetLanguage;
  fileName?: string;
  windowTitle?: string;
  theme?: CodeSnippetTheme;
  showLineNumbers?: boolean;
  startLine?: number;
  highlightLines?: number[];
  accentColor?: string;
  output?: OutputOptions;
}

export interface CodeSnippetLayout {
  code: string;
  language: CodeSnippetLanguage;
  fileName?: string;
  windowTitle?: string;
  theme: CodeSnippetTheme;
  showLineNumbers: boolean;
  startLine: number;
  highlightLines: number[];
  accentColor?: string;
}

export type TokenType =
  "comment" | "string" | "number" | "keyword" | "function" | "punctuation" | "plain";

export interface Token {
  text: string;
  type: TokenType;
}

export interface LanguageConfig {
  lineComment?: string;
  keywords: Set<string>;
}

export interface CodeSnippetDimensions {
  width: number;
  height: number;
  windowWidth: number;
  windowHeight: number;
  gutterWidth: number;
  codeAreaWidth: number;
  lines: string[];
}
