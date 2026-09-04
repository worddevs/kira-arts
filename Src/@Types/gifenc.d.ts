declare module "gifenc" {
  export interface GifWriteFrameOptions {
    palette?: number[][];
    delay?: number;
    transparent?: boolean;
    dispose?: number;
  }

  export interface GifEncoderInstance {
    writeFrame(
      index: Uint8Array | Uint8ClampedArray,
      width: number,
      height: number,
      options?: GifWriteFrameOptions,
    ): void;

    finish(): void;

    bytes(): Uint8Array;
  }

  export function GIFEncoder(): GifEncoderInstance;

  export function quantize(data: Uint8ClampedArray | Uint8Array, maxColors: number): number[][];

  export function applyPalette(
    data: Uint8ClampedArray | Uint8Array,
    palette: number[][],
  ): Uint8Array;

  const gifenc: {
    GIFEncoder: typeof GIFEncoder;
    quantize: typeof quantize;
    applyPalette: typeof applyPalette;
  };

  export default gifenc;
}
