import type { Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { createCanvas, loadImage } from "@napi-rs/canvas";

import { parseUsername, getDateOrString } from "../strings.utils";
import { withFallback } from "../fonts.utils";
import { parseHex, isString } from "../validations.utils";
import type { ProfileOptions, KiraUserData, KiraServerTag } from "../../@Types/index";
import { alphaValue, clydeID } from "./constants";
import { genStatus } from "./avatar";

export async function genTextAndAvatar(
  data: KiraUserData,
  options: ProfileOptions,
  avatarData: string,
): Promise<{ canvas: Canvas; verifBadgeX: number; verifBadgeY: number }> {
  const { basicInfo } = data;
  const { globalName, username: rawUsername, discriminator, bot, createdTimestamp, id } = basicInfo;

  const isClyde = id === clydeID;
  const pixelLength = bot ? 470 : 555;

  let canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const fixedUsername = options?.customUsername || globalName || rawUsername;

  const { username, newSize } = parseUsername(
    fixedUsername,
    ctx,
    "Helvetica Bold",
    "80",
    pixelLength,
  );

  if (options?.customSubtitle && !options.rankData) {
    ctx.globalAlpha = alphaValue;
    ctx.fillStyle = "#2a2d33";
    ctx.beginPath();
    ctx.roundRect(304, 248, 380, 33, [12]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = withFallback("23px Helvetica");
    ctx.textAlign = "left";
    ctx.fillStyle = options?.color ? options.color : "#dadada";
    ctx.fillText(`${options?.customSubtitle}`, 314, 273);
  }

  const createdDateString = getDateOrString(
    options?.customDate,
    createdTimestamp,
    options?.localDateType,
  );

  if (isClyde && !options?.customTag) {
    options.customTag = "@clyde";
  }

  const tag = options?.customTag
    ? isString(options.customTag, "customTag")
    : !discriminator
      ? `@${rawUsername}`
      : `#${discriminator}`;

  ctx.font = withFallback(`${newSize}px Helvetica Bold`);
  ctx.textAlign = "left";
  ctx.fillStyle = options?.usernameColor ? parseHex(options.usernameColor) : "#FFFFFF";
  ctx.fillText(username, 300, 155);

  const usernameWidth = ctx.measureText(username).width;
  let verifBadgeX = 300 + usernameWidth + 10;
  let verifBadgeY = 110;

  const useCompactTag = options?.compactTag ?? bot;

  if (useCompactTag) {
    const tagFontSize = Math.round(newSize * 0.32);
    const tagX = 300 + usernameWidth + 8;

    if (bot) {
      const pillHeight = 36;
      const gap = 6;
      const tagCapHeight = tagFontSize * 0.716;
      const usernameCenterY = 155 - newSize * 0.358;
      const blockHeight = pillHeight + gap + tagCapHeight;
      const blockTop = Math.round(usernameCenterY - blockHeight / 2);

      verifBadgeX = tagX;
      verifBadgeY = blockTop;

      const tagY = Math.round(blockTop + pillHeight + gap + tagCapHeight);

      ctx.font = withFallback(`${tagFontSize}px Helvetica Bold`);
      ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : "#dadada";
      ctx.fillText(tag, tagX, tagY);

      if (!options?.removeServerTag && data?.decoration?.serverTag) {
        await genServerTag(
          ctx,
          data.decoration.serverTag,
          tagX + ctx.measureText(tag).width,
          tagY + 24,
        );
      }
    } else {
      const tagY = 155 - Math.round(newSize * 0.42);

      ctx.font = withFallback(`${tagFontSize}px Helvetica Bold`);
      ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : "#dadada";
      ctx.fillText(tag, tagX, tagY);

      const tagWidth = ctx.measureText(tag).width;
      verifBadgeX = tagX + tagWidth + 10;

      if (!options?.removeServerTag && data?.decoration?.serverTag) {
        await genServerTag(ctx, data.decoration.serverTag, tagX + tagWidth, tagY + 24);
      }
    }
  } else if (!options?.rankData) {
    ctx.font = withFallback("60px Helvetica");
    ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : "#dadada";
    ctx.fillText(tag, 300, 215);

    if (!options?.removeServerTag && data?.decoration?.serverTag) {
      await genServerTag(ctx, data.decoration.serverTag, 300 + ctx.measureText(tag).width, 215);
    }
  }

  ctx.font = withFallback("23px Helvetica");
  ctx.textAlign = "center";
  ctx.fillStyle = "#dadada";
  ctx.fillText(createdDateString, 775, 273);

  const cardAvatar = await loadImage(avatarData);

  const roundValue = options?.squareAvatar ? 30 : 225;

  ctx.beginPath();
  ctx.roundRect(47, 39, 225, 225, [roundValue]);
  ctx.clip();

  ctx.fillStyle = "#292b2f";
  ctx.beginPath();
  ctx.roundRect(47, 39, 225, 225, [roundValue]);
  ctx.fill();

  ctx.drawImage(cardAvatar, 47, 39, 225, 225);

  ctx.closePath();

  if (options?.presenceStatus) {
    canvas = await genStatus(canvas, options);
  }

  return { canvas, verifBadgeX, verifBadgeY };
}

async function genServerTag(
  ctx: SKRSContext2D,
  serverTag: KiraServerTag,
  anchorX: number,
  baselineY: number,
): Promise<void> {
  const { text, badgeURL } = serverTag;
  const label = text.toUpperCase();

  ctx.font = withFallback("20px Helvetica Bold");
  const labelWidth = ctx.measureText(label).width;

  const badgeSize = badgeURL ? 18 : 0;
  const paddingX = 10;
  const gap = badgeURL ? 6 : 0;
  const pillHeight = 28;
  const pillWidth = paddingX * 2 + badgeSize + gap + labelWidth;

  const pillX = Math.max(10, Math.min(anchorX + 14, 885 - pillWidth - 10));
  const pillY = baselineY - pillHeight + 6;

  ctx.globalAlpha = alphaValue;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, [10]);
  ctx.fill();
  ctx.globalAlpha = 1;

  let cursorX = pillX + paddingX;

  const badgeImage = badgeURL ? await loadImage(badgeURL).catch(() => undefined) : undefined;
  if (badgeImage) {
    ctx.drawImage(badgeImage, cursorX, pillY + (pillHeight - badgeSize) / 2, badgeSize, badgeSize);
    cursorX += badgeSize + gap;
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#dadada";
  ctx.fillText(label, cursorX, pillY + pillHeight / 2 + 7);
}
