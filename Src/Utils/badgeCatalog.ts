import type { RawProfileBadge, CatalogEntry, BadgeCategory } from "../@Types/index";

const CATALOG: CatalogEntry[] = [
  { test: /^premium_tenure_\d+_month(_v\d+)?$/, name: "Discord Nitro", category: "nitro" },
  { test: /^premium$/, name: "Discord Nitro", category: "nitro" },
  { test: /^hypesquad_house_1$/, name: "HypeSquad Bravery", category: "hypesquadHouse" },
  { test: /^hypesquad_house_2$/, name: "HypeSquad Brilliance", category: "hypesquadHouse" },
  { test: /^hypesquad_house_3$/, name: "HypeSquad Balance", category: "hypesquadHouse" },
  { test: /^hypesquad_events$/, name: "HypeSquad Events", category: "hypesquadEvents" },
  { test: /^guild_booster_lvl\d+$/, name: "Server Booster", category: "boost" },
  { test: /^premium_guild_booster$/, name: "Server Booster", category: "boost" },
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
  { test: /^legacy_username$/, name: "Original Username", category: "legacyUsername" },
  { test: /^quest_completed$/, name: "Quest Completed", category: "quest" },
  { test: /^orb_profile_badge$/, name: "Orbs Collector", category: "orb" },
  { test: /^gifting$/, name: "Gifter", category: "gifting" },
  { test: /^guild_tag$/, name: "Guild Tag", category: "guildTag" },
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

export function resolveProfileBadgeIcon(badge: RawProfileBadge): string {
  if (badge.simple_icon_url) return badge.simple_icon_url;

  return `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`;
}
