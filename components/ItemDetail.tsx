"use client";

import { useEffect, useState } from "react";
import { LANGS, nameFor, type Item, type Lang } from "@/lib/airtable";
// LANGS is still used by pickDescription() below for fallback ordering.
import { formatPrice } from "@/components/ItemCard";
import ShareButton from "@/components/ShareButton";
import { t, tCondition, tKind, tStatus } from "@/lib/i18n";

// Marketplace channels. Brand names stay literal; "product" is localized at render.
const CHANNELS: { key: keyof Item["links"]; label: string }[] = [
  { key: "wallapop", label: "Wallapop" },
  { key: "milanuncios", label: "Milanuncios" },
  { key: "facebook", label: "Facebook" },
  { key: "telegram", label: "Telegram" },
  { key: "product", label: "" },
];

// Show the selected language, falling back to any non-empty one.
function pickDescription(item: Item, lang: Lang): string {
  if (item.descriptions[lang]) return item.descriptions[lang];
  for (const l of LANGS) if (item.descriptions[l]) return item.descriptions[l];
  return "";
}

export default function ItemDetail({
  item,
  lang,
  onClose,
}: {
  item: Item;
  lang: Lang;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const photos = item.photos;
  const photo = photos[idx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % Math.max(photos.length, 1));
      if (e.key === "ArrowLeft")
        setIdx((i) => (i - 1 + Math.max(photos.length, 1)) % Math.max(photos.length, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photos.length]);

  const description = pickDescription(item, lang);
  const title = nameFor(item, lang);
  const s = t(lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo carousel */}
        <div className="relative aspect-video w-full bg-gray-100">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.full} alt={title} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              sin foto
            </div>
          )}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-white hover:bg-black/70"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-white hover:bg-black/70"
                aria-label="Siguiente"
              >
                ›
              </button>
              <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
                {idx + 1}/{photos.length}
              </span>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-white hover:bg-black/70"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-gray-100 p-3">
            {photos.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={p.small}
                alt=""
                onClick={() => setIdx(i)}
                className={`h-14 w-14 flex-shrink-0 cursor-pointer rounded object-cover ${
                  i === idx ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        )}

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
                {item.status && (
                  <span className="rounded bg-green-50 px-2 py-0.5 text-[11px] text-green-700">
                    {tStatus(item.status, lang)}
                  </span>
                )}
              </div>
            </div>
            <div className="whitespace-nowrap text-2xl font-bold text-gray-900">
              {formatPrice(item.targetPrice)}
            </div>
          </div>

          {/* Description (language follows the toolbar toggle) */}
          <div>
            {description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {description}
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">{s.noDescription}</p>
            )}
          </div>

          {/* Share + marketplace links */}
          <div className="flex flex-wrap gap-2">
            <ShareButton id={item.id} lang={lang} variant="button" />
            {CHANNELS.filter((c) => item.links[c.key]).map((c) => (
              <a
                key={c.key}
                href={item.links[c.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand hover:text-white"
              >
                {c.key === "product" ? s.productSheet : c.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
