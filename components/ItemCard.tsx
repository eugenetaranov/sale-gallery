"use client";

import { nameFor, type Item, type Lang } from "@/lib/airtable";
import { tCondition, tKind } from "@/lib/i18n";
import ShareButton from "@/components/ShareButton";

export function formatPrice(v: number | null): string {
  return v == null ? "—" : `€${v}`;
}

export default function ItemCard({
  item,
  lang,
  onOpen,
}: {
  item: Item;
  lang: Lang;
  onOpen: () => void;
}) {
  const cover = item.photos[0];
  const title = nameFor(item, lang);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.large}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            sin foto
          </div>
        )}
        {item.photos.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
            1/{item.photos.length}
          </span>
        )}
        <ShareButton id={item.id} lang={lang} variant="icon" className="absolute right-2 top-2" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {item.kind && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {tKind(item.kind, lang)}
            </span>
          )}
          {item.condition && (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
              {tCondition(item.condition, lang)}
            </span>
          )}
        </div>
        <div className="mt-auto text-base font-semibold text-gray-900">
          {formatPrice(item.targetPrice)}
        </div>
      </div>
    </div>
  );
}
