import type { SKRSContext2D } from "@napi-rs/canvas";
import type { ParsedUsername } from "../@Types/user";
import { withFallback } from "./fonts.utils";

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

export function parseDurationString(duration: string | undefined | null): number | undefined {
  if (!duration || typeof duration !== "string") return undefined;

  const parts = duration.trim().split(":");
  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some((p) => p === "" || Number.isNaN(Number(p)))
  ) {
    return undefined;
  }

  const numbers = parts.map(Number);
  const [h, m, s] = numbers.length === 3 ? numbers : [0, numbers[0], numbers[1]];

  return (h * 3600 + m * 60 + s) * 1000;
}

export function truncateTextToWidth(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  ellipsis: string = "…",
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + ellipsis).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }

  return truncated.length > 0 ? truncated + ellipsis : ellipsis;
}

export function formatDuration(ms: number | undefined | null): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms < 0) return "0:00";

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}
