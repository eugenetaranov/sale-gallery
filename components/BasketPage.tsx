"use client";

import { useEffect, useState } from "react";
import { LANGS, type Item } from "@/lib/airtable";
import { parseBasketIds, useBasket } from "@/lib/basket";
import { useStoredLang } from "@/lib/useStoredLang";
import { t } from "@/lib/i18n";
import BasketContents from "@/components/BasketContents";

// Standalone, shareable basket view. With ?items=… it shows exactly those ids
// (the recipient's read-only view of a shared basket); without it, it shows the
// visitor's own saved basket, which they can still edit.
export default function BasketPage({
  items,
  sharedParam,
}: {
  items: Item[];
  sharedParam: string | null;
}) {
  const [lang, setLang] = useStoredLang();
  const basket = useBasket();
  const s = t(lang);

  const isShared = sharedParam !== null;
  // A shared basket comes from the URL, not the visitor's own storage, so its
  // edits live in local state (ephemeral) — removing trims the list and the
  // copied link. The visitor's own basket edits go through the store.
  const [sharedIds, setSharedIds] = useState<string[]>(() => parseBasketIds(sharedParam));
  const ids = isShared ? sharedIds : basket.ids;
  const onRemove = isShared
    ? (id: string) => setSharedIds((prev) => prev.filter((x) => x !== id))
    : basket.remove;

  // Shared view only: keep the address bar in step with what's on screen, so the
  // URL you'd copy (or reload) matches the trimmed list. The own basket stays at
  // a clean /basket — adding ?items= there would make a reload look like a shared
  // link and drop edits into the ephemeral path. replaceState avoids piling up
  // history entries per removal.
  useEffect(() => {
    if (!isShared) return;
    const url = new URL(window.location.href);
    if (ids.length > 0) url.searchParams.set("items", ids.join(","));
    else url.searchParams.delete("items");
    window.history.replaceState(window.history.state, "", url);
  }, [ids, isShared]);

  return (
    <div className="min-h-screen">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <a href="/" className="text-sm font-medium text-white/90 hover:text-white" aria-label="Home">
            ← €
          </a>
          <h1 className="text-lg font-semibold">{s.basketTitle}</h1>
          <div className="ml-auto flex gap-1">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition ${
                  l === lang ? "bg-white text-brand" : "text-white/80 hover:bg-white/20"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Page/header span matches the catalog (max-w-7xl) so the width doesn't
          jump on navigation; the list itself stays narrow for readability. */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <BasketContents ids={ids} items={items} lang={lang} onRemove={onRemove} />
        </div>
      </main>
    </div>
  );
}
