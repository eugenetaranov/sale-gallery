"use client";

// Client-side "bucket": the set of items a visitor has picked out to enquire
// about. Persisted in localStorage so it survives reloads and tab switches, and
// shareable by encoding the ids into a /bucket?items=… URL (no backend needed —
// same philosophy as the ?item= deep links).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Item } from "@/lib/airtable";

const STORAGE_KEY = "sale-gallery:bucket";

type BucketValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const BucketContext = createContext<BucketValue | null>(null);

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function BucketProvider({ children }: { children: React.ReactNode }) {
  // Start empty so server render and first client render match; hydrate from
  // localStorage in an effect (the count badge flashes 0 → N once, on mount).
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readStored());
    // Reflect changes made in other tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Ignore quota / private-mode errors — the bucket just won't persist.
    }
  }, [ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<BucketValue>(
    () => ({ ids, has, toggle, remove, clear, count: ids.length }),
    [ids, has, toggle, remove, clear]
  );

  return <BucketContext.Provider value={value}>{children}</BucketContext.Provider>;
}

export function useBucket(): BucketValue {
  const ctx = useContext(BucketContext);
  if (!ctx) throw new Error("useBucket must be used within a BucketProvider");
  return ctx;
}

/** Build the shareable /bucket URL that encodes the picked item ids. */
export function buildBucketUrl(ids: string[]): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/bucket?items=${ids.join(",")}`;
}

/** Parse the comma-separated ids from a /bucket?items= value. */
export function parseBucketIds(param: string | null | undefined): string[] {
  if (!param) return [];
  return param.split(",").map((s) => s.trim()).filter(Boolean);
}

// Items are only offered while Ready/Listed; a bucketed item whose record still
// exists but has moved on (Reserved/Sold/Given away/…) counts as unavailable.
const LISTABLE_STATUSES = ["Ready", "Listed"];

export type ResolvedBucket = {
  available: Item[]; // resolved + still listable, in the order they were added
  unavailable: Item[]; // resolved but the status has since changed
  missingCount: number; // ids that no longer resolve to any record (deleted)
  total: number; // € sum over available items (null price / free counts as 0)
};

/**
 * Match bucket ids against the currently-loaded items, tolerating drift: items
 * may be sold, reserved, or deleted between when they were added and when the
 * (possibly shared) bucket is viewed. Nothing here throws on a stale id.
 */
export function resolveBucket(items: Item[], ids: string[]): ResolvedBucket {
  const byId = new Map(items.map((i) => [i.id, i] as const));
  const available: Item[] = [];
  const unavailable: Item[] = [];
  let missingCount = 0;

  for (const id of ids) {
    const item = byId.get(id);
    if (!item) {
      missingCount++;
      continue;
    }
    if (LISTABLE_STATUSES.includes(item.status)) available.push(item);
    else unavailable.push(item);
  }

  const total = available.reduce((sum, i) => sum + (i.targetPrice ?? 0), 0);
  return { available, unavailable, missingCount, total };
}
