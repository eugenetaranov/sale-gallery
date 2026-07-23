"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS, type Lang } from "@/lib/airtable";

const STORAGE_KEY = "sale-gallery:lang";

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && (LANGS as string[]).includes(v) ? (v as Lang) : null;
  } catch {
    return null;
  }
}

/**
 * Language preference backed by localStorage, shared across the catalog and the
 * basket page. Server + first client render use ES (so hydration matches), then
 * the stored choice is applied in an effect — a one-time flash at most.
 */
export function useStoredLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("ES");

  useEffect(() => {
    const stored = readStoredLang();
    if (stored) setLang(stored);
    // Pick up changes made in other tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = readStoredLang();
        if (next) setLang(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Skip the first run so the default ES doesn't overwrite a stored choice
  // before hydration reads it (same guard as the basket store).
  const persisted = useRef(false);
  useEffect(() => {
    if (!persisted.current) {
      persisted.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore quota / private-mode errors — the choice just won't persist.
    }
  }, [lang]);

  return [lang, setLang];
}
