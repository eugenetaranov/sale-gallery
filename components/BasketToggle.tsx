"use client";

import type { Lang } from "@/lib/airtable";
import { useBasket } from "@/lib/basket";
import { t } from "@/lib/i18n";
import Tooltip from "@/components/Tooltip";

// A shopping-bag glyph; the checkmark is added when the item is in the basket.
function BagIcon({ checked, className = "" }: { checked: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      {checked ? <path d="M9 13l2 2 4-4" /> : <path d="M16 10a4 4 0 0 1-8 0" />}
    </svg>
  );
}

export default function BasketToggle({
  id,
  lang = "ES",
  variant = "button",
  className = "",
}: {
  id: string;
  lang?: Lang;
  variant?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle } = useBasket();
  const inBasket = has(id);
  const s = t(lang);
  const label = inBasket ? s.inBasket : s.addToBasket;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        aria-pressed={inBasket}
        className={`group/tip flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ring-1 transition ${
          inBasket
            ? "bg-brand text-white ring-brand hover:bg-brand/90"
            : "bg-white text-gray-800 ring-black/10 hover:bg-gray-50 hover:text-black"
        } ${className}`}
      >
        <BagIcon checked={inBasket} className="h-4 w-4" />
        <Tooltip align="left">{label}</Tooltip>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={inBasket}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
        inBasket
          ? "bg-brand text-white hover:bg-brand/90"
          : "border border-brand text-brand hover:bg-brand hover:text-white"
      } ${className}`}
    >
      <BagIcon checked={inBasket} className="h-4 w-4" />
      {label}
    </button>
  );
}
