export { KiraErrorCode } from "./common";

export type {
  PresenceStatus,
  BorderAlign,
  OutputFormat,
  OutputOptions,
  ColorValue,
  ColorInput,
  KiraCacheOptions,
  KiraFontFamily,
  WatermarkPosition,
  KiraWatermarkOptions,
  GifFrame,
  DecodedGifFrame,
  DecodedAnimatedGif,
  FetchedImageSource,
  ConfettiParticle,
  MemberEventDrawOverrides,
  AttachmentOptions,
} from "./common";

export type {
  KiraThemeName,
  KiraThemePalette,
  KiraNameplatePalette,
  ColorResolutionSources,
  CanvasBadge,
} from "./theme";

export type {
  KiraBadge,
  KiraNameplate,
  KiraServerTag,
  KiraUserBasicInfo,
  KiraUserAssets,
  KiraUserDecoration,
  KiraUserData,
  RawUserProfileResponse,
  ParsedUsername,
  CacheEntry,
  KiraMemberInfo,
  ShipLayout,
  TextEffect,
  BannerLine,
  MemberEventLayout,
  ResolvedLeaderboardEntry,
  BadgeCategory,
  CatalogEntry,
  RawProfileBadge,
} from "./user";

export type {
  RankOptions,
  MemberEventOptions,
  MemberEventLayoutStyle,
  MemberEventSize,
  LevelUpOptions,
  LevelUpLayout,
  AchievementRarity,
  AchievementOptions,
  AchievementLayout,
  ShipOptions,
  LeaderboardEntry,
  LeaderboardOptions,
  ProfileOptions,
  NowPlayingTrack,
  NowPlayingOptions,
  SourceIconKind,
  SourceMeta,
  NowPlayingLayout,
  GiveawayStatus,
  GiveawayWinner,
  GiveawayOptions,
  GiveawayLayout,
} from "./options";

export type {
  MoonlinkTrackLike,
  LavalinkTrackLike,
  DiscordPlayerTrackLike,
  DistubeSongLike,
} from "./adapters";
