import { KiraError } from "../Utils/error.utils";
import { fetchUserData } from "../Utils/fetch.utils";
import { genPng } from "../Utils/profileImage.output.utils";
import { getThemePalette } from "../Utils/themes.utils";
import type { ProfileOptions} from "../@Types/index";
import { KiraErrorCode } from "../@Types/index";

export async function profileImage(userId: string, options: ProfileOptions = {}): Promise<Buffer> {
  if (!userId || typeof userId !== "string")
    throw new KiraError(
      `TypeError: Invalid argument for profileImage()\nExpected string userId, got ${typeof userId === "undefined" || !userId ? "undefined" : typeof userId}`,
      KiraErrorCode.Validation,
    );

  const data = await fetchUserData(userId, options.guildId, options.bypassCache);

  const palette = getThemePalette(options.theme);

  const resolvedOptions: ProfileOptions = {
    ...options,
    usernameColor: options.usernameColor ?? palette?.usernameColor,
    tagColor: options.tagColor ?? palette?.tagColor,
    borderColor: options.borderColor ?? palette?.borderColor,
  };

  if (resolvedOptions.rankData) {
    resolvedOptions.rankData = {
      ...resolvedOptions.rankData,
      barColor: resolvedOptions.rankData.barColor ?? palette?.barColor,
      levelColor: resolvedOptions.rankData.levelColor ?? palette?.levelColor,
    };
  }

  try {
    const buffer = await genPng(data, resolvedOptions);

    return buffer;
  } catch (error: unknown) {
    if (error instanceof KiraError) throw error;

    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("source rejected")) {
      throw new KiraError(`Error loading user assets, try again later`, KiraErrorCode.AssetLoad);
    }

    throw new KiraError(message, KiraErrorCode.Render);
  }
}
