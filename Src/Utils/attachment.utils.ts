import { AttachmentBuilder } from "discord.js";

import { extensionForFormat } from "./output.utils";
import type { OutputFormat } from "../@Types/index";

export function toAttachment(
  buffer: Buffer,
  name = "card",
  format?: OutputFormat,
): AttachmentBuilder {
  const fileName = name.includes(".") ? name : `${name}.${extensionForFormat(format)}`;
  return new AttachmentBuilder(buffer, { name: fileName });
}
