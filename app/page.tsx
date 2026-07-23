import CatalogRoute from "@/app/CatalogRoute";
import { coerceLang } from "@/lib/airtable";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// "/" opens the For sale catalog. ?lang= sets the initial language server-side
// so a shared link renders in that language without a flash.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <CatalogRoute initialLang={coerceLang(lang)} />;
}
