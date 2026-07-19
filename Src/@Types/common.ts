export type PresenceStatus =
  "online" | "idle" | "offline" | "dnd" | "invisible" | "streaming" | "phone";

export type BorderAlign = "horizontal" | "vertical";

export type ColorValue = string | number;
export type ColorInput = ColorValue | ColorValue[];

export type OutputFormat = "png" | "jpeg" | "webp";

export interface OutputOptions {
  format?: OutputFormat;
  quality?: number;
}

export enum KiraErrorCode {
  Validation = "VALIDATION",
  Fetch = "FETCH",
  AssetLoad = "ASSET_LOAD",
  Render = "RENDER",
  Config = "CONFIG",
}
