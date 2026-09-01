import { AttachmentBuilder } from "discord.js";

import { extensionForFormat } from "./output.utils";
import type { OutputFormat, AttachmentOptions } from "../@Types/index";

export function toAttachment(
  buffer: Buffer,
  nameOrOptions?: string | AttachmentOptions,
  format?: OutputFormat,
): AttachmentBuilder {
  let name = "card";
  let resolvedFormat = format;

  if (typeof nameOrOptions === "string") {
    name = nameOrOptions;
  } else if (nameOrOptions) {
    name = nameOrOptions.name ?? name;
    resolvedFormat = nameOrOptions.extension ?? resolvedFormat;
  }

  const fileName = name.includes(".") ? name : `${name}.${extensionForFormat(resolvedFormat)}`;
  return new AttachmentBuilder(buffer, { name: fileName });
}
