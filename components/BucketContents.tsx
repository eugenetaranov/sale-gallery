"use client";

import { useState } from "react";
import { nameFor, type Item, type Lang } from "@/lib/airtable";
import { buildBucketUrl, resolveBucket, useBucket } from "@/lib/bucket";
import { t, tStatus } from "@/lib/i18n";
import { copyText } from "@/components/ShareButton";
import { formatPrice } from "@/components/ItemCard";

// One line in the basket. `dim` marks status-changed items (kept visible so the
// buyer sees what dropped off, but excluded from the total).
function Row({
  item,
  lang,
  editable,
  dim = false,
}: {
  item: Item;
  lang: Lang;
  editable: boolean;
  dim?: boolean;
}) {
  const { remove } = useBucket();
  const s = t(lang);
  const cover = item.photos[0];

  return (
    <li className={`flex items-center gap-3 py-3 ${dim ? "opacity-60" : ""}`}>
      {/* Opens the item in a new tab via the same deep link used elsewhere. */}
      <a
        href={`/?item=${item.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover.small} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 group-hover:text-brand group-hover:underline">
            {nameFor(item, lang)}
          </p>
          {dim ? (
            <span className="mt-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
              {s.noLongerAvailable} · {tStatus(item.status, lang)}
            </span>
          ) : (
            <span
              className={`text-sm font-semibold ${
                item.targetPrice === 0 ? "text-emerald-600" : "text-gray-700"
              }`}
            >
              {formatPrice(item.targetPrice, lang)}
            </span>
          )}
        </div>
      </a>
      {editable && (
        <button
          onClick={() => remove(item.id)}
          aria-label={s.remove}
          title={s.remove}
          className="flex-shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </li>
  );
}

export default function BucketContents({
  ids,
  items,
  lang,
  editable,
}: {
  ids: string[];
  items: Item[];
  lang: Lang;
  editable: boolean;
}) {
  const s = t(lang);
  const [copied, setCopied] = useState(false);
  const { available, unavailable, missingCount, total } = resolveBucket(items, ids);
  // Nothing from the basket survived the drift (all sold / deleted).
  const allGone = ids.length > 0 && available.length === 0 && unavailable.length === 0;

  const onShare = async () => {
    const ok = await copyText(buildBucketUrl(ids));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (ids.length === 0 || allGone) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        {ids.length === 0
          ? s.basketEmpty
          : `${missingCount || ids.length} ${s.someUnavailable}`}
      </p>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto">
        {available.map((item) => (
          <Row key={item.id} item={item} lang={lang} editable={editable} />
        ))}
        {unavailable.map((item) => (
          <Row key={item.id} item={item} lang={lang} editable={editable} dim />
        ))}
      </ul>

      {missingCount > 0 && (
        <p className="pt-3 text-xs text-gray-400">
          {missingCount} {s.someUnavailable}
        </p>
      )}

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {s.total}
            {available.length > 0 && (
              <span className="ml-1 text-gray-400">
                · {available.length} {s.items}
              </span>
            )}
          </span>
          <span className="text-lg font-bold text-gray-900">€{total}</span>
        </div>

        <button
          onClick={onShare}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          {copied ? s.linkCopied : s.copyLink}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">{s.basketShareHint}</p>
      </div>
    </div>
  );
}
