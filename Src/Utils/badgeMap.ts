import type { KiraBadge } from "../@Types/index";

const BASE = "https://raw.githubusercontent.com/kenndeclouv/badges-discord/main/assets";

export const BADGE_MAP: Record<string, KiraBadge> = {
  Staff: { name: "Discord Staff", icon: `${BASE}/discordstaff.svg` },
  Partner: { name: "Partnered Server Owner", icon: `${BASE}/discordpartner.svg` },
  Hypesquad: { name: "HypeSquad Events", icon: `${BASE}/hypesquadevents.svg` },
  BugHunterLevel1: { name: "Discord Bug Hunter", icon: `${BASE}/discordbughunter1.svg` },
  BugHunterLevel2: { name: "Discord Bug Hunter", icon: `${BASE}/discordbughunter2.svg` },
  HypeSquadOnlineHouse1: { name: "HypeSquad Bravery", icon: `${BASE}/hypesquadbravery.svg` },
  HypeSquadOnlineHouse2: { name: "HypeSquad Brilliance", icon: `${BASE}/hypesquadbrilliance.svg` },
  HypeSquadOnlineHouse3: { name: "HypeSquad Balance", icon: `${BASE}/hypesquadbalance.svg` },
  PremiumEarlySupporter: { name: "Early Supporter", icon: `${BASE}/discordearlysupporter.svg` },
  VerifiedDeveloper: { name: "Early Verified Bot Developer", icon: `${BASE}/discordbotdev.svg` },
  CertifiedModerator: { name: "Discord Certified Moderator", icon: `${BASE}/discordmod.svg` },
  ActiveDeveloper: { name: "Active Developer", icon: `${BASE}/activedeveloper.svg` },
  VerifiedBot: { name: "Verified Bot", icon: `${BASE}/verifiedbot.svg` },
};
