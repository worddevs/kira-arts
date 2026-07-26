import "./profileImage.output.utils";

import {
  createMemberEventCanvas,
  drawMemberEventCard,
  getCardDimensions,
} from "./MemberEeventCard/index";
import { encodeCanvas } from "./output.utils";
import type { OutputOptions, MemberEventLayout } from "../@Types/index";

export async function genMemberEventPng(
  avatarUrl: string,
  username: string,
  layout: MemberEventLayout,
  output?: OutputOptions,
): Promise<Buffer> {
  const { width, height } = getCardDimensions(layout);
  const { canvas, ctx } = createMemberEventCanvas(width, height);

  await drawMemberEventCard(ctx, width, height, avatarUrl, username, layout);

  return encodeCanvas(canvas, output);
}
