import CatalogRoute from "@/app/CatalogRoute";
import { coerceLang } from "@/lib/airtable";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// "/free" opens the donated (giveaway) tab directly — a shareable link.
// ?lang= sets the initial language server-side (no flash on shared links).
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <CatalogRoute initialLang={coerceLang(lang)} />;
}
