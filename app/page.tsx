import CatalogRoute from "@/app/CatalogRoute";
import { coerceLang, parseCsvParam, strParam } from "@/lib/airtable";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// "/" opens the For sale catalog. ?lang= / ?search= / ?kinds= set the initial
// language, search, and category filters server-side so a shared, filtered link
// renders that view without a flash.
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
