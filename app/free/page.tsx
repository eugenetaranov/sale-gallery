import CatalogRoute from "@/app/CatalogRoute";
import { coerceLang, parseCsvParam, strParam } from "@/lib/airtable";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// "/free" opens the donated (giveaway) tab directly — a shareable link.
// ?lang= / ?search= / ?kinds= set the initial language, search, and category
// filters server-side (no flash on shared, filtered links).
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; search?: string; kinds?: string }>;
}) {
  const sp = await searchParams;
  return (
    <CatalogRoute
      initialLang={coerceLang(sp.lang)}
      initialQuery={strParam(sp.search)}
      initialKinds={parseCsvParam(sp.kinds)}
    />
  );
}
