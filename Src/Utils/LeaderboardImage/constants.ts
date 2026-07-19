import type { LeaderboardEntry, KiraUserData } from "../../@Types/index";

export const CARD_WIDTH = 720;
export const ROW_HEIGHT = 100;
export const ROW_GAP = 14;
export const PADDING = 26;
export const CORNER_RADIUS = 28;

export const RANK_COLORS: Record<number, string> = {
  1: "#F1C40F",
  2: "#B9BBC6",
  3: "#D08A3E",
};

export const DEFAULT_ACCENT = "#2DD4BF";
export const DEFAULT_ROW_BASE = "#1c2128";

export interface ResolvedLeaderboardEntry {
  entry: LeaderboardEntry & { rank: number };
  data: KiraUserData;
}
