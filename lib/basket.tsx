"use client";

// Client-side "basket": the set of items a visitor has picked out to enquire
// about. Persisted in localStorage so it survives reloads and tab switches, and
// shareable by encoding the ids into a /basket?items=… URL (no backend needed —
// same philosophy as the ?item= deep links).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Item } from "@/lib/airtable";

const STORAGE_KEY = "sale-gallery:basket";

type BasketValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};

const BasketContext = createContext<BasketValue | null>(null);

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

export function BasketProvider({ children }: { children: React.ReactNode }) {
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

  // Skip the very first run: on mount `ids` is still the empty initial state, so
  // persisting it would clobber the stored basket to [] before hydration reads
  // it — which wiped the basket when navigating to /basket and back.
  const persisted = useRef(false);
  useEffect(() => {
    if (!persisted.current) {
      persisted.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Ignore quota / private-mode errors — the basket just won't persist.
    }
  }, [ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<BasketValue>(
    () => ({ ids, has, toggle, remove, clear, count: ids.length }),
    [ids, has, toggle, remove, clear]
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket(): BasketValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within a BasketProvider");
  return ctx;
}

/** Build the shareable /basket URL that encodes the picked item ids. */
export function buildBasketUrl(ids: string[]): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/basket?items=${ids.join(",")}`;
}

/** Parse the comma-separated ids from a /basket?items= value. */
export function parseBasketIds(param: string | null | undefined): string[] {
  if (!param) return [];
  return param.split(",").map((s) => s.trim()).filter(Boolean);
}

// Statuses still shown as live in the basket. Reserved items stay on the list
// (marked as reserved in the row); only items that have truly moved on
// (Sold / Given away / Kept / Draft / deleted) count as unavailable.
const LISTABLE_STATUSES = ["Ready", "Listed", "Reserved"];

export type ResolvedBasket = {
  available: Item[]; // resolved + still listable, in the order they were added
  unavailable: Item[]; // resolved but the status has since changed
  missingCount: number; // ids that no longer resolve to any record (deleted)
  total: number; // € sum over available items (null price / free counts as 0)
};

/**
 * Match basket ids against the currently-loaded items, tolerating drift: items
 * may be sold, reserved, or deleted between when they were added and when the
 * (possibly shared) basket is viewed. Nothing here throws on a stale id.
 */
export function resolveBasket(items: Item[], ids: string[]): ResolvedBasket {
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
