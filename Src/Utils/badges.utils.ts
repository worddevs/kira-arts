import type { Client, UserFlagsBitField, UserFlagsString } from "discord.js";
import type { KiraBadge } from "../@Types/index";

const ICON_BASE = "https://raw.githubusercontent.com/kenndeclouv/badges-discord/main/assets";

const BOOST_BADGE: KiraBadge = {
  name: "Server Booster",
  icon: `${ICON_BASE}/boosts/discordboost1.svg`,
};

export interface KiraMemberInfo {
  boostBadge: KiraBadge | null;
  roleColor: string | null;
}

export async function getGuildMemberInfo(
  client: Client,
  guildId: string,
  userId: string,
): Promise<KiraMemberInfo> {
  try {
    const guild = client.guilds.cache.get(guildId) ?? (await client.guilds.fetch(guildId));
    const member = await guild.members.fetch(userId);
    const displayColor = member.displayHexColor;

    return {
      boostBadge: member.premiumSince ? BOOST_BADGE : null,
      roleColor: displayColor && displayColor !== "#000000" ? displayColor : null,
    };
  } catch {
    return { boostBadge: null, roleColor: null };
  }
}

const FLAG_BADGES: Partial<Record<UserFlagsString, KiraBadge>> = {
  Staff: { name: "Discord Staff", icon: `${ICON_BASE}/discordstaff.svg` },
  Partner: { name: "Partnered Server Owner", icon: `${ICON_BASE}/discordpartner.svg` },
  CertifiedModerator: { name: "Moderator Programs Alumni", icon: `${ICON_BASE}/discordmod.svg` },
  Hypesquad: { name: "HypeSquad Events", icon: `${ICON_BASE}/hypesquadevents.svg` },
  BugHunterLevel2: { name: "Discord Bug Hunter", icon: `${ICON_BASE}/discordbughunter2.svg` },
  BugHunterLevel1: { name: "Discord Bug Hunter", icon: `${ICON_BASE}/discordbughunter1.svg` },
  HypeSquadOnlineHouse1: { name: "HypeSquad Bravery", icon: `${ICON_BASE}/hypesquadbravery.svg` },
  HypeSquadOnlineHouse2: {
    name: "HypeSquad Brilliance",
    icon: `${ICON_BASE}/hypesquadbrilliance.svg`,
  },
  HypeSquadOnlineHouse3: { name: "HypeSquad Balance", icon: `${ICON_BASE}/hypesquadbalance.svg` },
  VerifiedDeveloper: {
    name: "Early Verified Bot Developer",
    icon: `${ICON_BASE}/discordbotdev.svg`,
  },
  ActiveDeveloper: { name: "Active Developer", icon: `${ICON_BASE}/activedeveloper.svg` },
  VerifiedBot: { name: "Verified Bot", icon: `${ICON_BASE}/verifiedbot.svg` },
  PremiumEarlySupporter: {
    name: "Early Supporter",
    icon: `${ICON_BASE}/discordearlysupporter.svg`,
  },
};

const DISPLAY_ORDER: UserFlagsString[] = [
  "Staff",
  "Partner",
  "CertifiedModerator",
  "Hypesquad",
  "BugHunterLevel2",
  "BugHunterLevel1",
  "HypeSquadOnlineHouse1",
  "HypeSquadOnlineHouse2",
  "HypeSquadOnlineHouse3",
  "VerifiedDeveloper",
  "ActiveDeveloper",
  "VerifiedBot",
  "PremiumEarlySupporter",
];

export function getBadgesFromFlags(flags: UserFlagsBitField | null | undefined): KiraBadge[] {
  if (!flags) return [];

  const active = new Set(flags.toArray());

  return DISPLAY_ORDER.filter((flag) => active.has(flag))
    .map((flag) => FLAG_BADGES[flag])
    .filter((badge): badge is KiraBadge => Boolean(badge));
}
