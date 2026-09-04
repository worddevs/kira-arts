import type { Canvas, Image } from "@napi-rs/canvas";

export type PresenceStatus =
  "online" | "idle" | "offline" | "dnd" | "invisible" | "streaming" | "phone";

export type BorderAlign = "horizontal" | "vertical";

export type ColorValue = string | number;
export type ColorInput = ColorValue | ColorValue[];

export type KiraFontFamily =
  "default" | "arial" | "impact" | "georgia" | "courierNew" | "verdana" | "tahoma";

export type OutputFormat = "png" | "jpeg" | "webp" | "gif";

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

export interface KiraCacheOptions {
  enabled?: boolean;
  ttl?: number;
}

export type WatermarkPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "center"
  | "center-left"
  | "center-right";

export interface KiraWatermarkOptions {
  text?: string;
  imageUrl?: string;
  position?: WatermarkPosition;
  opacity?: number;
  fontSize?: number;
  color?: string;
  margin?: number;
  scale?: number;
  size?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface GifFrame {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface DecodedGifFrame {
  canvas: Canvas;
  delay: number;
}

export interface DecodedAnimatedGif {
  frames: DecodedGifFrame[];
  width: number;
  height: number;
  totalDuration: number;
}

export interface FetchedImageSource {
  bytes: Uint8Array;
  animated: DecodedAnimatedGif | null;
}

export interface ConfettiParticle {
  x: number;
  startY: number;
  speed: number;
  size: number;
  color: string;
  drift: number;
  rotation: number;
  spin: number;
}

export interface MemberEventDrawOverrides {
  backgroundImage?: Canvas | Image;
  avatarImage?: Canvas | Image;
}

export interface AttachmentOptions {
  name?: string;
  extension?: OutputFormat;
}
