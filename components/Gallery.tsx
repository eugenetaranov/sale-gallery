"use client";

import { useEffect, useMemo, useState } from "react";
import { nameFor, type Item, type Lang } from "@/lib/airtable";
import { t } from "@/lib/i18n";
import Toolbar, { type SortKey } from "@/components/Toolbar";
import ItemCard from "@/components/ItemCard";
import ItemDetail from "@/components/ItemDetail";
import PrintCatalog from "@/components/PrintCatalog";

const SALE_STATUSES = ["Ready", "Listed"];

export default function Gallery({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [lang, setLang] = useState<Lang>("ES");
  const [active, setActive] = useState<Item | null>(null);

  // Open the item referenced by ?item=recId on first load (deep link / shared link).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("item");
    if (id) {
      const found = items.find((i) => i.id === id);
      if (found) setActive(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the address bar in sync with the open item, so copying the URL from the
  // browser bar works too and Back closes the modal-shaped view.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (active) url.searchParams.set("item", active.id);
    else url.searchParams.delete("item");
    window.history.replaceState(null, "", url.toString());
  }, [active]);

  const kinds = useMemo(
    () => Array.from(new Set(items.map((i) => i.kind).filter(Boolean))).sort(),
    [items]
  );

  // The PDF catalog always covers the whole sale list (ignoring the on-screen
  // filters/search/sort), grouped by category then price for a stable order.
  const saleItems = useMemo(
    () =>
      items
        .filter((i) => SALE_STATUSES.includes(i.status))
        .sort((a, b) => {
          if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
          const pa = a.targetPrice ?? Number.POSITIVE_INFINITY;
          const pb = b.targetPrice ?? Number.POSITIVE_INFINITY;
          return pa - pb;
        }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = items.filter((i) => {
      if (!SALE_STATUSES.includes(i.status)) return false;
      if (selectedKinds.length && !selectedKinds.includes(i.kind)) return false;
      // Search across all language titles so items are findable in any language.
      if (q && !Object.values(i.names).join(" ").toLowerCase().includes(q)) return false;
      return true;
    });

    const price = (i: Item) => (i.targetPrice ?? Number.POSITIVE_INFINITY);
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return price(a) - price(b);
        case "price-desc":
          return price(b) - price(a);
        case "name":
          return nameFor(a, lang).localeCompare(nameFor(b, lang));
        default:
          return 0;
      }
    });
    return result;
  }, [items, query, selectedKinds, sort, lang]);

  const toggleKind = (kind: string) =>
    setSelectedKinds((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]
    );

  const s = t(lang);

  return (
    <>
    <div className="min-h-screen no-print">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-white/20 text-sm font-bold">
            €
          </div>
          <h1 className="text-lg font-semibold">{s.headerTitle}</h1>
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {filtered.length} {s.items}
          </span>
          <button
            onClick={() => window.print()}
            className="ml-auto rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
          >
            {s.exportPdf}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <Toolbar
          query={query}
          onQuery={setQuery}
          kinds={kinds}
          selectedKinds={selectedKinds}
          onToggleKind={toggleKind}
          onClearKinds={() => setSelectedKinds([])}
          sort={sort}
          onSort={setSort}
          lang={lang}
          onLang={setLang}
        />

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-sm text-gray-500">{s.noResults}</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} lang={lang} onOpen={() => setActive(item)} />
            ))}
          </div>
        )}
      </div>

      {active && (
        <ItemDetail item={active} lang={lang} onClose={() => setActive(null)} />
      )}
    </div>

    <PrintCatalog items={saleItems} lang={lang} />
    </>
  );
}
