import type { KiraNameplatePalette } from "./theme";

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
