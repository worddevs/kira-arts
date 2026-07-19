import { KiraError } from "./error.utils";

export function parseImg(imgString: string): string {
  if (!imgString || typeof imgString !== "string") {
    throw new KiraError(
      `Invalid custom badge ('${imgString || undefined}') must be an image file 'png | jpg | jpeg | gif'`,
    );
  }

  const URL = imgString.split(".");
  const imgType = URL[URL.length - 1];
  const imgCheck = /(jpg|jpeg|png|gif)/gi.test(imgType);

  if (!imgCheck)
    throw new KiraError(
      `Invalid customBackground ('${imgString || undefined}') must be an image file 'png | jpg | jpeg | gif'`,
    );

  return imgString;
}

export function parsePng(imgString: string): string {
  if (!imgString || typeof imgString !== "string") {
    throw new KiraError(`Invalid custom badge ('${imgString || undefined}') must be a png file`);
  }

  const URL = imgString.split(".");
  const imgType = URL[URL.length - 1];
  const imgCheck = /(png)/gi.test(imgType);

  if (!imgCheck)
    throw new KiraError(`Invalid custom badge ('${imgString || undefined}') must be a png file`);

  return imgString;
}

export type ColorValue = string | number;

export function decimalToHex(decimal: number): string {
  if (!Number.isFinite(decimal) || decimal < 0 || decimal > 0xffffff) {
    throw new KiraError(`Invalid decimal color code (${decimal}), must be between 0 and 16777215`);
  }

  return "#" + Math.round(decimal).toString(16).padStart(6, "0");
}

export function parseHex(input: ColorValue): string {
  const hexRegex = new RegExp(/^(#)?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/);

  if (typeof input === "number") return decimalToHex(input);

  let hexString = String(input ?? "").trim();

  if (hexRegex.test(hexString)) {
    if (!hexString.startsWith("#")) hexString = "#" + hexString;

    return hexString;
  }

  if (/^\d+$/.test(hexString)) return decimalToHex(Number(hexString));

  throw new KiraError(`Invalid Hex Code ('${input === "" ? undefined : input}')`);
}

export function isString(param: unknown, type: string): string {
  if (typeof param !== "string")
    throw new KiraError(`Invalid ${type} (${param}), must be a string`);

  return param;
}

export function isNumber(param: unknown, type: string): number {
  if (typeof param !== "number" || isNaN(param))
    throw new KiraError(`Invalid ${type} (${param}), must be a number`);

  return param;
}
