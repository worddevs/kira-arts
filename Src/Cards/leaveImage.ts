import { renderMemberEventCard } from "./memberEvent";
import type { MemberEventOptions } from "../@Types/index";

const DEFAULT_LEAVE_MESSAGE = "{username} has left {server}.";

export async function leaveImage(
  userId: string,
  guildName: string,
  options: MemberEventOptions = {},
): Promise<Buffer> {
  return renderMemberEventCard(userId, guildName, DEFAULT_LEAVE_MESSAGE, options);
}
