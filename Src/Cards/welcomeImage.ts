import { renderMemberEventCard } from "./memberEvent";
import type { MemberEventOptions } from "../@Types/index";

const DEFAULT_WELCOME_MESSAGE = "¡Welcome to {server}!";

export async function welcomeImage(
  userId: string,
  guildName: string,
  options: MemberEventOptions = {},
): Promise<Buffer> {
  return renderMemberEventCard(userId, guildName, DEFAULT_WELCOME_MESSAGE, options);
}
