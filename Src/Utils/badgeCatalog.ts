import type { RawProfileBadge } from "../@Types/index";

/**
 * Categories let us de-duplicate badges that can come from two different
 * Discord sources at once (the `public_flags` bitmask AND the richer
 * `/users/{id}/profile` payload). When both sources describe the same kind
 * of badge (e.g. HypeSquad house, Bug Hunter) we prefer the profile-sourced
 * one, since it uses Discord's current CDN icon set.
 */
export type BadgeCategory =
  | "staff"
  | "partner"
  | "certifiedMod"
  | "hypesquadEvents"
  | "hypesquadHouse"
  | "bugHunter"
  | "verifiedDeveloper"
  | "activeDeveloper"
  | "verifiedBot"
  | "nitro"
  | "boost"
  | "quest"
  | "orb"
  | "legacyUsername"
  | "gifting"
  | "guildTag"
  | "event"
  | "other";

interface CatalogEntry {
  /** Matches the raw `badge.id` returned by Discord. */
  test: RegExp;
  /** Generic, user-friendly display name (raw `description` is per-user/dated). */
  name: string;
  category: BadgeCategory;
}

/**
 * Reference table built from real `badges` payloads returned by
 * `/users/{id}/profile`. This only needs to be updated when Discord ships a
 * new badge type, not on every request — that's the whole point of keeping
 * it static instead of re-deriving names at runtime.
 *
 * Unknown ids simply fall back to Discord's own `description` field, so
 * nothing breaks the day a brand-new badge shows up before this list is
 * updated.
 */
const CATALOG: CatalogEntry[] = [
  // Nitro tenure (id includes month count + a version suffix that changes,
  // e.g. "premium_tenure_12_month_v2" -> matched by pattern, not exact id).
  { test: /^premium_tenure_\d+_month(_v\d+)?$/, name: "Discord Nitro", category: "nitro" },
  { test: /^premium$/, name: "Discord Nitro", category: "nitro" },

  // HypeSquad houses (also present in public_flags, kept here so the
  // profile-sourced icon wins over the legacy flag-based one).
  { test: /^hypesquad_house_1$/, name: "HypeSquad Bravery", category: "hypesquadHouse" },
  { test: /^hypesquad_house_2$/, name: "HypeSquad Brilliance", category: "hypesquadHouse" },
  { test: /^hypesquad_house_3$/, name: "HypeSquad Balance", category: "hypesquadHouse" },
  { test: /^hypesquad_events$/, name: "HypeSquad Events", category: "hypesquadEvents" },

  // Server boosting (per-account level badge, distinct from per-guild
  // `member.premiumSince`).
  { test: /^guild_booster_lvl\d+$/, name: "Server Booster", category: "boost" },
  { test: /^premium_guild_booster$/, name: "Server Booster", category: "boost" },

  // Bug Hunter / Staff / Partner / Certified Mod — also covered by
  // public_flags, listed here to keep the profile source authoritative.
  { test: /^bug_hunter_level_1$/, name: "Discord Bug Hunter", category: "bugHunter" },
  { test: /^bug_hunter_level_2$/, name: "Discord Bug Hunter", category: "bugHunter" },
  { test: /^staff$/, name: "Discord Staff", category: "staff" },
  { test: /^partner$/, name: "Partnered Server Owner", category: "partner" },
  {
    test: /^certified_moderator$/,
    name: "Moderator Programs Alumni",
    category: "certifiedMod",
  },
  {
    test: /^verified_developer$/,
    name: "Early Verified Bot Developer",
    category: "verifiedDeveloper",
  },
  { test: /^active_developer$/, name: "Active Developer", category: "activeDeveloper" },
  { test: /^verified_bot$/, name: "Verified Bot", category: "verifiedBot" },

  // Only obtainable via profile payload — no public_flags equivalent.
  { test: /^legacy_username$/, name: "Original Username", category: "legacyUsername" },
  { test: /^quest_completed$/, name: "Quest Completed", category: "quest" },
  { test: /^orb_profile_badge$/, name: "Orbs Collector", category: "orb" },
  { test: /^gifting$/, name: "Gifter", category: "gifting" },
  { test: /^guild_tag$/, name: "Guild Tag", category: "guildTag" },

  // Time-limited event badges (e.g. "april_fools_2026"). Matched generically
  // so future yearly events don't require a code change.
  {
    test: /^(april_fools|halloween|winter|summer|anniversary)_\d{4}$/,
    name: "Event Badge",
    category: "event",
  },
];

export function lookupBadgeCatalog(id: string): { name: string; category: BadgeCategory } | null {
  for (const entry of CATALOG) {
    if (entry.test.test(id)) return { name: entry.name, category: entry.category };
  }
  return null;
}

/**
 * Resolves the final icon URL for a raw profile badge.
 * Discord sends two shapes:
 *  - most badges: only an `icon` hash -> https://cdn.discordapp.com/badge-icons/{hash}.png
 *  - some badges (e.g. "gifting"): a ready-made `simple_icon_url` that must
 *    be used as-is instead of the badge-icons path.
 */
export function resolveProfileBadgeIcon(badge: RawProfileBadge): string {
  if (badge.simple_icon_url) return badge.simple_icon_url;
  return `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`;
}
