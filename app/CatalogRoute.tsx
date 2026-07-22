import { getItems, type Item } from "@/lib/airtable";
import Gallery from "@/components/Gallery";

// Shared server entry for the catalog routes ("/" = For sale, "/free" =
// donated). Both render the same Gallery; the active tab is derived from the
// URL path inside Gallery, so each tab is a real, shareable link.
export default async function CatalogRoute() {
  let items: Item[] = [];
  let error: string | null = null;

  try {
    items = await getItems();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido";
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-2 text-xl font-semibold text-brand">No se pudieron cargar los artículos</h1>
        <p className="whitespace-pre-wrap rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</p>
      </main>
    );
  }

  return <Gallery items={items} />;
}
