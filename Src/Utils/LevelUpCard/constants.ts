import type { KiraBadge } from "../../@Types/index";

export const CARD_WIDTH = 700;
export const CARD_HEIGHT = 260;
export const CORNER_RADIUS = 26;
export const AVATAR_SIZE = 128;
export const AVATAR_BORDER = 5;

export interface LevelUpLayout {
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
