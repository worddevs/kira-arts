import { MESSAGE_POOL } from "./constants";

export function hashPair(a: string, b: string): number {
  const combined = [a, b].sort().join(":");
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 33) ^ combined.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function computeCompatibility(leftId: string, rightId: string): number {
  return hashPair(leftId, rightId) % 101;
}

export function pickShipMessage(leftId: string, rightId: string, percentage: number): string {
  const bucket =
    MESSAGE_POOL.find((entry) => percentage >= entry.min) ?? MESSAGE_POOL[MESSAGE_POOL.length - 1];
  const index = hashPair(leftId, rightId) % bucket.messages.length;

  return bucket.messages[index];
}
