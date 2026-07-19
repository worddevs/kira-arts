import type { SKRSContext2D } from "@napi-rs/canvas";
import { withFallback } from "./fonts.utils";

export interface ParsedUsername {
  username: string;
  newSize: number;
  textLength: number;
}

export function parseUsername(
  username: string,
  ctx: SKRSContext2D,
  font: string,
  size: string | number,
  maxLength: number,
): ParsedUsername {
  username = username && username.replace(/\s/g, "") ? username : "?????";
  const usernameChars = username.split("");

  let finalUsername = "";

  let newSize = +size;
  let textLength = 0;

  let finalized = false;

  while (!finalized) {
    const currentUsername = usernameChars.join("");

    ctx.font = withFallback(`${newSize}px ${font}`);
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";

    const actualLength = ctx.measureText(currentUsername).width;

    if (actualLength >= maxLength) {
      if (newSize > 60) newSize -= 1;
      else usernameChars.pop();
    }

    if (actualLength <= maxLength) {
      finalUsername = currentUsername;
      textLength = actualLength;
      finalized = true;
    }
  }

  return {
    username: finalUsername,
    newSize,
    textLength,
  };
}

function getFirstDigitsAsDecimal(numString: string): string {
  const digits = ((numString.length - 1) % 3) + 1;
  if (numString.length < 4) {
    return numString;
  }

  const decimal = numString.slice(digits, digits + 1);
  return `${numString.slice(0, digits)}${
    decimal == "0" || decimal == "00" || digits == 3 ? "" : `.${decimal.replace(/0$/g, "")}`
  }`;
}

export function abbreviateNumber(number: number | string): string {
  const numString = `${number}`;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const abbreviations = ["", "K", "M", "B", "T"].concat(
    new Array(letters.length).fill("AA").map((_, i) => letters[i].repeat(2)),
  );

  const selectedAbbr = abbreviations[Math.floor((numString.length - 1) / 3)] ?? "??";
  return `${getFirstDigitsAsDecimal(numString)}${selectedAbbr}`;
}

export function getDateOrString(
  dateInput: Date | string | undefined | null,
  createdTimestamp: number | string,
  localDateType: string = "en",
): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (typeof dateInput === "string") {
    if (iso8601Regex.test(dateInput)) {
      const dateInstance = new Date(dateInput);
      return dateInstance.toLocaleDateString(localDateType, dateOptions);
    } else {
      return dateInput;
    }
  } else if (dateInput instanceof Date) {
    return dateInput.toLocaleDateString(localDateType, dateOptions);
  } else {
    return new Date(+createdTimestamp).toLocaleDateString(localDateType, dateOptions);
  }
}

export function truncateText(text: string, limit: number = 25, fromEnd: boolean = false): string {
  if (text.length > limit) {
    if (fromEnd) {
      return "..." + text.slice(-limit);
    } else {
      return text.slice(0, limit) + "...";
    }
  } else {
    return text;
  }
}
