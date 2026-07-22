"use client";

export type SectionItem<K extends string> = { key: K; label: string; count: number };

// Header section switcher as a light text menu: two labels, no track or pills.
// The active one is solid white with a thin underline; the others are dimmed.
// Counts are quiet inline numbers. Both stay visible so the choice is obvious.
export default function SectionSwitch<K extends string>({
  items,
  active,
  onSelect,
}: {
  items: SectionItem<K>[];
  active: K;
  onSelect: (key: K) => void;
}) {
  return (
    <div role="tablist" className="inline-flex items-center gap-5">
      {items.map((item) => {
        const on = item.key === active;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-1.5 border-b-2 pb-1 pt-0.5 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
              on
                ? "border-white text-white"
                : "border-transparent text-white/60 hover:text-white/90"
            }`}
          >
            {item.label}
            {/* Reserved width + tabular figures so the count doesn't shift the
                menu when it changes (e.g. 35 → 5 while filtering). */}
            <span
              className={`inline-block min-w-[1.5rem] text-left text-xs font-medium tabular-nums ${
                on ? "text-white/70" : "text-white/45"
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
