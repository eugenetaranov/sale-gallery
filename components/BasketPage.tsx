"use client";

import { useState } from "react";
import { LANGS, type Item, type Lang } from "@/lib/airtable";
import { parseBasketIds, useBasket } from "@/lib/basket";
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
  const [lang, setLang] = useState<Lang>("ES");
  const basket = useBasket();
  const s = t(lang);

  const isShared = sharedParam !== null;
  const ids = isShared ? parseBasketIds(sharedParam) : basket.ids;

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
          <BasketContents ids={ids} items={items} lang={lang} editable={!isShared} />
        </div>
      </main>
    </div>
  );
}
