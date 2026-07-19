import type { Client } from "discord.js";
import { createCanvas } from "@napi-rs/canvas";

import { KiraError } from "./error.utils";
import { getBadgesFromFlags, getGuildMemberInfo } from "./badges.utils";
import { getClient } from "../client";
import { buildCacheKey, getCached, setCached } from "./cache.utils";
import type { KiraUserData, RawUserProfileResponse } from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";
import { decimalToHex } from "./validations.utils";
import { loadImageSafe } from "./canvasShared.utils";

const NAMEPLATE_CDN_BASE = "https://cdn.discordapp.com/assets/collectibles";

const MATH_SCRIPT_FALLBACK_MAP: Record<string, string> = {
  "𝒜": "A",
  ℬ: "B",
  "𝒞": "C",
  "𝒟": "D",
  ℰ: "E",
  ℱ: "F",
  "𝒢": "G",
  ℋ: "H",
  ℐ: "I",
  "𝒥": "J",
  "𝒦": "K",
  ℒ: "L",
  ℳ: "M",
  "𝒩": "N",
  "𝒪": "O",
  "𝒫": "P",
  "𝒬": "Q",
  ℛ: "R",
  "𝒮": "S",
  "𝒯": "T",
  "𝒰": "U",
  "𝒱": "V",
  "𝒲": "W",
  "𝒳": "X",
  "𝒴": "Y",
  "𝒵": "Z",
  "𝒶": "a",
  "𝒷": "b",
  "𝒸": "c",
  "𝒹": "d",
  ℯ: "e",
  "𝒻": "f",
  ℊ: "g",
  "𝒽": "h",
  "𝒾": "i",
  "𝒿": "j",
  "𝓀": "k",
  "𝓁": "l",
  "𝓂": "m",
  "𝓃": "n",
  "𝑜": "o",
  "𝓅": "p",
  "𝓆": "q",
  "𝓇": "r",
  "𝓈": "s",
  "𝓉": "t",
  "𝓊": "u",
  "𝓋": "v",
  "𝓌": "w",
  "𝓍": "x",
  "𝓎": "y",
  "𝓏": "z",
};

function applyMathScriptFallback(value: string): string {
  let result = "";
  for (const char of value) {
    result += MATH_SCRIPT_FALLBACK_MAP[char] ?? char;
  }
  return result;
}

function normalizeDisplayText<T extends string | null>(value: T): T {
  if (typeof value !== "string") return value;
  try {
    const normalized = value.normalize("NFKC");
    if (normalized !== value) return normalized as T;
    return applyMathScriptFallback(normalized) as T;
  } catch {
    return value;
  }
}

async function computeBannerAverageColor(bannerUrl: string | null): Promise<string | null> {
  if (!bannerUrl) return null;

  const image = await loadImageSafe(bannerUrl, 1, 4000);

  if (!image) return null;

  try {
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 1, 1);
    const { data } = ctx.getImageData(0, 0, 1, 1);
    return (
      "#" +
      [data[0], data[1], data[2]].map((channel) => channel.toString(16).padStart(2, "0")).join("")
    );
  } catch {
    return null;
  }
}

async function fetchNitroThemeColors(
  client: Client,
  userId: string,
  fallbackAccent: string | null,
): Promise<string[] | null> {
  try {
    const profile = (await client.rest.get(
      `/users/${userId}/profile?with_mutual_guilds=false&with_mutual_friends=false&with_mutual_friends_count=false`,
    )) as RawUserProfileResponse;

    const themeColors = profile.user_profile_customization?.theme_colors ?? profile.theme_colors;

    if (Array.isArray(themeColors) && themeColors.length >= 2) {
      return [decimalToHex(themeColors[0]), decimalToHex(themeColors[1])];
    }

    if (Array.isArray(themeColors) && themeColors.length === 1) {
      return [decimalToHex(themeColors[0])];
    }
  } catch (error: unknown) {
    if (process.env.KIRA_DEBUG) {
      const details =
        typeof error === "object" && error !== null && "rawError" in error
          ? (error as { rawError: unknown }).rawError
          : error instanceof Error
            ? error.message
            : error;

      console.warn(`[kira-arts] Nitro theme fetch failed for ${userId}:`, details);
    }
  }

  return fallbackAccent ? [fallbackAccent] : null;
}

export async function fetchUserData(
  userId: string,
  guildId?: string,
  bypassCache = false,
): Promise<KiraUserData> {
  const cacheKey = buildCacheKey(userId, guildId);

  if (!bypassCache) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  const client = getClient();

  try {
    const user = await client.users.fetch(userId, { force: true });

    const nameplateData = user.collectibles?.nameplate ?? null;
    const primaryGuild = user.primaryGuild;
    const hasServerTag = Boolean(primaryGuild?.identityEnabled && primaryGuild?.tag);

    const badges = getBadgesFromFlags(user.flags);
    let roleColor: string | null = null;
    if (guildId) {
      const memberInfo = await getGuildMemberInfo(client, guildId, userId);
      if (memberInfo.boostBadge) badges.push(memberInfo.boostBadge);
      roleColor = memberInfo.roleColor;
    }

    const bannerUrl = user.bannerURL({ size: 128 }) ?? null;
    const accentFallback = user.hexAccentColor ?? (await computeBannerAverageColor(bannerUrl));
    const profileColors = await fetchNitroThemeColors(client, userId, accentFallback);

    const result: KiraUserData = {
      basicInfo: {
        id: user.id,
        username: normalizeDisplayText(user.username),
        globalName: normalizeDisplayText(user.globalName),
        discriminator: user.discriminator === "0" ? null : user.discriminator,
        bot: user.bot,
        verified: user.flags?.has("VerifiedBot") ?? false,
        createdTimestamp: user.createdTimestamp,
      },
      assets: {
        avatarURL: user.avatarURL({ size: 512, extension: "png", forceStatic: true }),
        defaultAvatarURL: user.defaultAvatarURL,
        bannerURL: user.bannerURL({ size: 512 }) ?? null,
        badges,
      },
      decoration: {
        avatarFrame: user.avatarDecorationURL({ size: 256 }) ?? null,
        profileColors,
        roleColor,
        nameplate: nameplateData
          ? {
              imageURL: `${NAMEPLATE_CDN_BASE}/${nameplateData.asset}static.png`,
              palette: nameplateData.palette,
            }
          : null,
        serverTag: hasServerTag
          ? {
              text: normalizeDisplayText(primaryGuild!.tag as string),
              badgeURL: user.guildTagBadgeURL({ size: 64 }),
            }
          : null,
      },
    };

    setCached(cacheKey, result);
    return result;
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : undefined;

    throw new KiraError(message || "Could not fetch user data", KiraErrorCode.Fetch);
  }
}
