export const CARD_WIDTH = 700;
export const CARD_HEIGHT = 260;
export const CORNER_RADIUS = 26;
export const AVATAR_SIZE = 150;
export const AVATAR_BORDER = 6;
export const HEART_WIDTH = 140;
export const HEART_HEIGHT = 150;

export const DEFAULT_ACCENT = "#EC4899";

export const MESSAGE_POOL: Array<{ min: number; messages: string[] }> = [
  {
    min: 90,
    messages: [
      "Definitely the cutest couple.",
      "A perfect match—this is true love.",
      "Soulmates confirmed.",
    ],
  },
  {
    min: 70,
    messages: [
      "There's great chemistry here.",
      "This looks very promising.",
      "A strong connection is forming.",
    ],
  },
  {
    min: 40,
    messages: [
      "It could work with a little effort.",
      "It's a close call—anything could happen.",
      "Not amazing, but there's potential.",
    ],
  },
  {
    min: 0,
    messages: ["Better off staying friends.", "This needs a lot of work.", "Fate had other plans."],
  },
];
