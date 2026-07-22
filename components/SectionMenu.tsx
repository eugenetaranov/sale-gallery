"use client";

import { useEffect, useRef, useState } from "react";

export type SectionItem<K extends string> = { key: K; label: string; count: number };

// Header section switcher: the page title itself is a menu button. Replaces the
// old title + duplicated tab bar. Counts live in the popover; the active item is
// marked with a check (not colour alone) for accessibility.
export default function SectionMenu<K extends string>({
  items,
  active,
  onSelect,
}: {
  items: SectionItem<K>[];
  active: K;
  onSelect: (key: K) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeItem = items.find((i) => i.key === active) ?? items[0];

  // Close on outside click / Escape; return focus to the button on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Focus the active item when the menu opens.
  useEffect(() => {
    if (open) {
      const idx = Math.max(0, items.findIndex((i) => i.key === active));
      itemRefs.current[idx]?.focus();
    }
  }, [open, active, items]);

  const moveFocus = (from: number, dir: 1 | -1) => {
    const next = (from + dir + items.length) % items.length;
    itemRefs.current[next]?.focus();
  };

  const choose = (key: K) => {
    onSelect(key);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-[2.25rem] items-center gap-1.5 rounded-md px-2 py-1 text-lg font-semibold text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        {/* Grid stack reserves the wider label's width so the count badge beside
            the header doesn't jump when the section changes (any language). */}
        <span className="grid text-left">
          {items.map((i) => (
            <span key={i.key} aria-hidden className="invisible col-start-1 row-start-1">
              {i.label}
            </span>
          ))}
          <span className="col-start-1 row-start-1">{activeItem.label}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-1.5 min-w-[13rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-gray-900 shadow-lg"
        >
          {items.map((item, idx) => {
            const on = item.key === active;
            return (
              <button
                key={item.key}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                role="menuitemradio"
                aria-checked={on}
                onClick={() => choose(item.key)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    moveFocus(idx, 1);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    moveFocus(idx, -1);
                  }
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition focus:outline-none ${
                  on ? "font-semibold text-brand" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 flex-shrink-0 ${on ? "opacity-100" : "opacity-0"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="flex-1">{item.label}</span>
                <span
                  className={`rounded-full px-1.5 text-xs font-medium ${
                    on ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
