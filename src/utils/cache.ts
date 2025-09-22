import { config } from "@/config";

type CacheEntry<T> = {
  value: T;
  expiresAt: number | null;
};

type CacheStore = {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs?: number): void;
  delete(key: string): void;
  clear(): void;
};

export class MemoryCache implements CacheStore {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    const expiresAt = typeof ttlMs === "number" ? Date.now() + ttlMs : null;
    this.store.set(key, { value, expiresAt });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export class LocalStorageCache implements CacheStore {
  constructor(private prefix = "cache:") {}

  private k(key: string) {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | undefined {
    if (typeof window === "undefined" || !("localStorage" in window)) return undefined;
    try {
      const raw = window.localStorage.getItem(this.k(key));
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as CacheEntry<T>;
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(this.k(key));
        return undefined;
      }
      return parsed.value;
    } catch {
      // Corrupt entry; remove it to be safe
      try {
        window.localStorage.removeItem(this.k(key));
      } catch {}
      return undefined;
    }
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    const expiresAt = typeof ttlMs === "number" ? Date.now() + ttlMs : null;
    try {
      const payload: CacheEntry<T> = { value, expiresAt };
      window.localStorage.setItem(this.k(key), JSON.stringify(payload));
    } catch {
      // Ignore storage quota/serialization errors
    }
  }

  delete(key: string): void {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    try {
      window.localStorage.removeItem(this.k(key));
    } catch {}
  }

  clear(): void {
    if (typeof window === "undefined" || !("localStorage" in window)) return;
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) toRemove.push(k);
      }
      toRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch {}
  }
}

export const defaultCache: CacheStore =
  typeof window !== "undefined" && "localStorage" in window
    ? new LocalStorageCache("cache:")
    : new MemoryCache();

// Stable stringify for building keys
export const stableStringify = (value: unknown): string => {
  const seen = new WeakSet();
  const stringify = (v: unknown): any => {
    if (typeof v === "function") return v.toString();
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v as object)) return "[Circular]";
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(stringify);
    const obj = v as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce((acc: Record<string, unknown>, k) => {
        acc[k] = stringify(obj[k]);
        return acc;
      }, {});
  };
  return JSON.stringify(stringify(value));
};

export const cacheKeyFrom = (namespace: string, args: unknown[]): string =>
  `${namespace}:${stableStringify(args)}`;

export const memoizeAsync = <F extends (...args: any[]) => Promise<any>>(
  fn: F,
  {
    ttlMs,
    cache = defaultCache,
    key,
    namespace = fn.name || "fn",
  }: {
    ttlMs?: number;
    cache?: CacheStore;
    key?: (...args: Parameters<F>) => string;
    namespace?: string;
  } = {},
): F => {
  if (!config.perf.caching) return fn;

  const memoized = (async (...args: Parameters<F>) => {
    const k = key ? key(...args) : cacheKeyFrom(namespace, args);
    const existing = cache.get<ReturnType<F>>(k);
    if (existing !== undefined) return existing as Awaited<ReturnType<F>>;
    const value = await fn(...(args as any));
    if ((Array.isArray(value) && value.length > 0) || value) cache.set(k, value, ttlMs);
    return value;
  }) as F;
  return memoized;
};
