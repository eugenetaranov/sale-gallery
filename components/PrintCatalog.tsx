import { isTallPhoto, nameFor, pickDescription, type Item, type Lang } from "@/lib/airtable";
import { formatPrice } from "@/components/ItemCard";
import { t, tCondition, tKind } from "@/lib/i18n";

// Print-only catalog of the whole sale list. Rendered off-canvas on screen
// (see .print-only in globals.css) so its cover images preload; @media print
// reveals it and hides the interactive UI. Items arrive pre-filtered to sale
// statuses and pre-sorted by kind then price, so we can group them in order.
export default function PrintCatalog({ items, lang }: { items: Item[]; lang: Lang }) {
  const s = t(lang);

  // Group consecutive items by category (input is sorted by kind).
  const groups: { kind: string; items: Item[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.kind === item.kind) last.items.push(item);
    else groups.push({ kind: item.kind, items: [item] });
  }

  return (
    <div className="print-only bg-white text-gray-900">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h1 className="text-2xl font-bold">{s.headerTitle}</h1>
        <p className="text-sm text-gray-500">
          {items.length} {s.items}
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.kind} className="mb-4">
          {group.kind && (
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
              {tKind(group.kind, lang)}
            </h2>
          )}
          <div className="grid grid-cols-2 gap-3">
            {group.items.map((item) => {
              const cover = item.photos[0];
              const title = nameFor(item, lang);
              const description = pickDescription(item, lang);
              return (
                <div
                  key={item.id}
                  className="print-card flex gap-3 rounded-lg border border-gray-200 p-2"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.large}
                        alt={title}
                        className={`h-full w-full ${isTallPhoto(cover) ? "object-contain" : "object-cover"}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                        sin foto
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug">{title}</h3>
                      <span className="whitespace-nowrap text-sm font-bold">
                        {formatPrice(item.targetPrice, lang)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.kind && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                          {tKind(item.kind, lang)}
                        </span>
                      )}
                      {item.condition && (
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                          {tCondition(item.condition, lang)}
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="print-desc text-[11px] leading-snug text-gray-700">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
