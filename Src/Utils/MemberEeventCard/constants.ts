import type { KiraBadge, KiraServerTag } from "../../@Types/index";

export const CARD_WIDTH = 700;
export const CORNER_RADIUS = 28;
export const BANNER_HEIGHT = 170;
export const BASE_AVATAR_SIZE = 172;
export const AVATAR_BORDER = 6;

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
