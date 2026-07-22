"use client";

import { useState } from "react";
import type { Lang } from "@/lib/airtable";
import { t } from "@/lib/i18n";
import Tooltip from "@/components/Tooltip";

// Build a shareable, deep-linkable URL for a single item.
export function buildShareUrl(id: string): string {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?item=${id}`;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ShareButton({
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
  const [copied, setCopied] = useState(false);
  const s = t(lang);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyText(buildShareUrl(id));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={onClick}
        aria-label={s.copyLink}
        className={`group/tip flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-800 shadow-sm ring-1 ring-black/10 transition hover:bg-gray-50 hover:text-black ${
          copied ? "text-green-600 hover:text-green-600" : ""
        } ${className}`}
      >
        {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        <Tooltip align="right">{copied ? s.linkCopied : s.copyLink}</Tooltip>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand/90 ${className}`}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      {copied ? s.linkCopied : s.copyLink}
    </button>
  );
}
