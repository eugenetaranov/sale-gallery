"use client";

import { useEffect } from "react";
import type { Item, Lang } from "@/lib/airtable";
import { useBasket } from "@/lib/basket";
import { t } from "@/lib/i18n";
import BasketContents from "@/components/BasketContents";

// Slide-over for assembling the basket while browsing. The full-page /basket
// route renders the same BasketContents for the shareable, standalone view.
export default function BasketDrawer({
  items,
  lang,
  open,
  onClose,
}: {
  items: Item[];
  lang: Lang;
  open: boolean;
  onClose: () => void;
}) {
  const { ids, count, clear } = useBasket();
  const s = t(lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label={s.basketTitle}
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">{s.basketTitle}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{count}</span>
          {count > 0 && (
            <button
              onClick={clear}
              className="ml-auto text-xs text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
            >
              {s.clearBasket}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className={`${count > 0 ? "" : "ml-auto"} rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <BasketContents ids={ids} items={items} lang={lang} editable />
        </div>

        {count > 0 && (
          <a
            href="/basket"
            className="border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-brand hover:underline"
          >
            {s.viewBasket} →
          </a>
        )}
      </aside>
    </>
  );
}
