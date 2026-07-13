"use client";

import { LANGS, type Lang } from "@/lib/airtable";
import { t, tKind } from "@/lib/i18n";

export type SortKey = "price-asc" | "price-desc" | "name";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  kinds: string[];
  selectedKinds: string[];
  onToggleKind: (kind: string) => void;
  onClearKinds: () => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  lang: Lang;
  onLang: (v: Lang) => void;
};

export default function Toolbar({
  query,
  onQuery,
  kinds,
  selectedKinds,
  onToggleKind,
  onClearKinds,
  sort,
  onSort,
  lang,
  onLang,
}: Props) {
  const s = t(lang);
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={s.searchPlaceholder}
          className="h-9 min-w-[160px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand"
        />

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="h-9 appearance-none rounded-md border border-gray-300 pl-3 pr-8 text-sm outline-none focus:border-brand"
            title={s.sortName}
          >
            <option value="price-asc">{s.sortPriceAsc}</option>
            <option value="price-desc">{s.sortPriceDesc}</option>
            <option value="name">{s.sortName}</option>
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <div className="flex overflow-hidden rounded-md border border-gray-300">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => onLang(l)}
              className={`h-9 w-9 text-xs font-medium ${
                lang === l ? "bg-brand text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title={`${s.language}: ${l}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {kinds.map((kind) => {
          const on = selectedKinds.includes(kind);
          return (
            <button
              key={kind}
              onClick={() => onToggleKind(kind)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                on
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tKind(kind, lang)}
            </button>
          );
        })}
        {selectedKinds.length > 0 && (
          <button
            onClick={onClearKinds}
            className="rounded-full px-2 py-1 text-xs text-gray-500 underline hover:text-gray-700"
          >
            {s.clear}
          </button>
        )}
      </div>
    </div>
  );
}
