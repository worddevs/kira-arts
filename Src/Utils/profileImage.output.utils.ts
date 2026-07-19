import { createCanvas } from "@napi-rs/canvas";

import {
  getBadges,
  genBase,
  genFrame,
  genTextAndAvatar,
  genAvatarFrame,
  genBorder,
  genBadges,
  genBotVerifBadge,
  genXpBar,
  genNameplate,
  addShadow,
} from "./ProfileImage/index";
import { ensureFontsRegistered } from "./fonts.utils";
import { encodeCanvas } from "./output.utils";
import { resolveCardColors } from "./canvasShared.utils";
import type { ProfileOptions, KiraUserData } from "../@Types/index";

ensureFontsRegistered();

export async function genPng(data: KiraUserData, options: ProfileOptions): Promise<Buffer> {
  const { basicInfo, assets } = data;
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const userAvatar = (assets.avatarURL ?? assets.defaultAvatarURL) + "?size=512";
  const userBanner = assets.bannerURL ? assets.bannerURL + "?size=512" : null;
  const badges = await getBadges(data, options);

  if (options?.removeBorder) ctx.roundRect(9, 9, 867, 285, [26]);
  else ctx.roundRect(0, 0, 885, 303, [34]);
  ctx.clip();

  const cardBase = await genBase(options, userAvatar, userBanner);
  ctx.drawImage(cardBase, 0, 0);

  const cardFrame = await genFrame(badges, options);
  ctx.drawImage(cardFrame, 0, 0);

  if (!options?.removeNameplate && data?.decoration?.nameplate) {
    const nameplate = await genNameplate(data);
    ctx.drawImage(nameplate, 0, 0);
  }

  const {
    canvas: cardTextAndAvatar,
    verifBadgeX,
    verifBadgeY,
  } = await genTextAndAvatar(data, options, userAvatar);
  const textAvatarShadow = addShadow(cardTextAndAvatar);
  ctx.drawImage(textAvatarShadow, 0, 0);
  ctx.drawImage(cardTextAndAvatar, 0, 0);

  const usingAutoNitroColors =
    !options?.removeBorder &&
    typeof options?.borderColor === "undefined" &&
    !options?.disableProfileTheme &&
    Boolean(data?.decoration?.profileColors?.length);

  if (usingAutoNitroColors && !options?.borderAllign) options.borderAllign = "vertical";

  const borderColors = resolveCardColors({
    custom: options?.borderColor,
    removeBorder: options?.removeBorder,
    useNitroTheme: !options?.disableProfileTheme,
    nitroColors: data?.decoration?.profileColors,
    useRoleColor: options?.useRoleColor,
    roleColor: data?.decoration?.roleColor,
  });

  if (borderColors.length > 0) {
    const border = await genBorder(borderColors, options);
    ctx.drawImage(border, 0, 0);
  }

  if (basicInfo?.bot) {
    const botVerifBadge = await genBotVerifBadge(data, verifBadgeX, verifBadgeY);
    const shadowVerifBadge = addShadow(botVerifBadge);
    ctx.drawImage(shadowVerifBadge, 0, 0);
    ctx.drawImage(botVerifBadge, 0, 0);
  }

  if (!options?.removeBadges) {
    const cardBadges = await genBadges(badges);
    const badgesShadow = addShadow(cardBadges);
    ctx.drawImage(badgesShadow, 0, 0);
    ctx.drawImage(cardBadges, 0, 0);
  }

  if (options?.rankData) {
    const xpBar = genXpBar(options);
    ctx.drawImage(xpBar, 0, 0);
  }

  if (!options?.removeAvatarFrame && data?.decoration?.avatarFrame) {
    const avatarFrame = await genAvatarFrame(data, options);
    ctx.drawImage(avatarFrame, 0, 0);
  }

  return encodeCanvas(canvas, options?.output);
}
