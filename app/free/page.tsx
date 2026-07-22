import CatalogRoute from "@/app/CatalogRoute";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// "/free" opens the donated (giveaway) tab directly — a shareable link.
export default function Page() {
  return <CatalogRoute />;
}
