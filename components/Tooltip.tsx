// Small hover/focus tooltip for icon-only buttons. The parent button must be a
// `group/tip` (an absolutely-positioned button already establishes the
// containing block this needs). A *named* group scopes the reveal to the button
// itself — the surrounding ItemCard is also a `group`, so an unscoped
// group-hover would pop the tooltip on any card hover. `align` anchors the
// bubble toward card-center so it isn't clipped by the card's overflow-hidden.
export default function Tooltip({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  const pos =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute top-full ${pos} z-20 mt-1.5 whitespace-nowrap rounded bg-gray-900/90 px-1.5 py-1 text-[10px] font-medium leading-none text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100`}
    >
      {children}
    </span>
  );
}
