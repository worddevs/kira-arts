import type { KiraUserData } from "../@Types/index";

export interface KiraCacheOptions {
  enabled?: boolean;
  ttl?: number;
}

interface CacheEntry {
  data: KiraUserData;
  expiresAt: number;
}

const DEFAULT_TTL = 12 * 60 * 60 * 1000;

let cacheEnabled = true;
let cacheTtl = DEFAULT_TTL;

const store = new Map<string, CacheEntry>();

export function setCacheOptions(options: KiraCacheOptions): void {
  if (typeof options.enabled === "boolean") cacheEnabled = options.enabled;
  if (typeof options.ttl === "number" && options.ttl > 0) cacheTtl = options.ttl;
}

export function buildCacheKey(userId: string, guildId?: string): string {
  return guildId ? `${userId}:${guildId}` : userId;
}

export function getCached(key: string): KiraUserData | null {
  if (!cacheEnabled) return null;

  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.data;
}

export function setCached(key: string, data: KiraUserData): void {
  if (!cacheEnabled) return;
  store.set(key, { data, expiresAt: Date.now() + cacheTtl });
}

export function clearCache(userId?: string, guildId?: string): void {
  if (userId) {
    store.delete(buildCacheKey(userId, guildId));
    return;
  }
  store.clear();
}

export function getCacheSize(): number {
  return store.size;
}
