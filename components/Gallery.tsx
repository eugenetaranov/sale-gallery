"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { nameFor, type Item, type Lang } from "@/lib/airtable";
import { t } from "@/lib/i18n";
import Toolbar, { type SortKey } from "@/components/Toolbar";
import ItemCard from "@/components/ItemCard";
import ItemDetail from "@/components/ItemDetail";
import PrintCatalog from "@/components/PrintCatalog";
import BasketDrawer from "@/components/BasketDrawer";
import { useBasket } from "@/lib/basket";

const SALE_STATUSES = ["Ready", "Listed"];

// A target price of exactly 0 means the item is a giveaway ("Free"); any other
// value (including null = unknown) belongs to the paid "For sale" tab.
const isFree = (i: Item) => i.targetPrice === 0;

type Tab = "sale" | "free";

export default function Gallery({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [lang, setLang] = useState<Lang>("ES");
  const [active, setActive] = useState<Item | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const basket = useBasket();

  // The active tab IS the URL path: "/" = For sale, "/free" = donated. This
  // makes each tab a real, shareable link. Switching tabs pushes the path via
  // the native History API, which Next syncs back into usePathname (so Back /
  // Forward and direct loads all work) without a full navigation.
  const pathname = usePathname();
  const activeTab: Tab = pathname === "/free" ? "free" : "sale";
  const selectTab = (next: Tab) => {
    const url = new URL(window.location.href);
    url.pathname = next === "free" ? "/free" : "/";
    window.history.pushState(null, "", url.toString());
  };

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

  // Tab counts: how many listable (Ready/Listed) items are free vs for sale.
  const listable = useMemo(
    () => items.filter((i) => SALE_STATUSES.includes(i.status)),
    [items]
  );
  const freeCount = useMemo(() => listable.filter(isFree).length, [listable]);
  const saleCount = listable.length - freeCount;
  // Surface the tabs once a giveaway exists, or whenever someone lands on the
  // shared /free link directly (so they always have a way back to For sale).
  const showTabs = freeCount > 0 || activeTab === "free";

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
      // Split the two tabs: "free" shows only giveaways, "sale" only the rest.
      if (activeTab === "free" ? !isFree(i) : isFree(i)) return false;
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
  }, [items, query, selectedKinds, sort, lang, activeTab]);

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
          <h1 className="text-lg font-semibold">
            {activeTab === "free" ? s.free : s.headerTitle}
          </h1>
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {filtered.length} {s.items}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setBasketOpen(true)}
              className="relative flex items-center gap-1.5 rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {s.basket}
              {/* Always shown (0 by default) so the button width is stable and
                  the basket is noticeable from the start. */}
              <span className="min-w-[1.25rem] rounded-full bg-white px-1.5 text-center text-[11px] font-semibold text-brand">
                {basket.count}
              </span>
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/30"
            >
              {s.exportPdf}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4">
        {showTabs && (
          <div
            role="tablist"
            aria-label={s.headerTitle}
            className="mb-4 inline-flex rounded-lg border border-gray-200 bg-white p-1"
          >
            {([
              { key: "sale", label: s.headerTitle, count: saleCount },
              { key: "free", label: s.free, count: freeCount },
            ] as const).map(({ key, label, count }) => {
              const on = activeTab === key;
              const isFreeTab = key === "free";
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => selectTab(key)}
                  className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    on
                      ? isFreeTab
                        ? "bg-emerald-600 text-white"
                        : "bg-brand text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      on ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

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

      <BasketDrawer
        items={items}
        lang={lang}
        open={basketOpen}
        onClose={() => setBasketOpen(false)}
      />
    </div>

    <PrintCatalog items={saleItems} lang={lang} />
    </>
  );
}
