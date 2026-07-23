"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS, type Lang } from "@/lib/airtable";

const STORAGE_KEY = "sale-gallery:lang";

function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as string[]).includes(v);
}

function readStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function readUrlLang(): Lang | null {
  try {
    const v = new URLSearchParams(window.location.search).get("lang");
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

/**
 * Language preference resolved from (in order): the ?lang= URL param, then
 * localStorage, else the server-provided `initial` (which itself already
 * reflects ?lang= via SSR, so a shared link renders in that language with no
 * flash). Changes are written to both localStorage and the URL, so the current
 * language is always shareable by copying the address.
 */
export function useStoredLang(initial: Lang = "ES"): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(initial);

  useEffect(() => {
    const urlLang = readUrlLang();
    if (urlLang) {
      setLang(urlLang);
      try {
        localStorage.setItem(STORAGE_KEY, urlLang);
      } catch {
        /* ignore */
      }
    } else {
      const stored = readStoredLang();
      if (stored) setLang(stored);
    }
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

  // Skip the first run so the initial state doesn't overwrite storage/URL before
  // hydration resolves the real choice (same guard as the basket store).
  const persisted = useRef(false);
  useEffect(() => {
    if (!persisted.current) {
      persisted.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    // Keep the address bar in sync so the current language is shareable.
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return [lang, setLang];
}
