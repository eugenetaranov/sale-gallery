"use client";

export type SectionItem<K extends string> = { key: K; label: string; count: number };

// Header section switcher as a segmented control: both sections stay visible
// (so the choice is obvious), each with its total count. Lives in the coloured
// header in place of the old title + separate tab bar. The active segment is a
// white pill with dark text (readable on red or green) plus an accent count.
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
    <div role="tablist" className="inline-flex items-center gap-0.5 rounded-lg bg-black/15 p-0.5">
      {items.map((item) => {
        const on = item.key === active;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
              on ? "bg-white text-gray-900 shadow-sm" : "text-white/90 hover:bg-white/10"
            }`}
          >
            {item.label}
            <span
              className={`rounded-full px-1.5 text-xs font-semibold ${
                on ? "bg-brand text-white" : "bg-white/25 text-white"
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
