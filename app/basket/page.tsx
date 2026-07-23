import { coerceLang, getItems, type Item } from "@/lib/airtable";
import BasketPage from "@/components/BasketPage";

// Refetch from Airtable every 10 min so signed photo URLs stay valid.
export const revalidate = 600;

// The shareable basket. "/basket?items=rec1,rec2" is the link a buyer sends;
// "/basket" with no param shows the visitor's own saved basket.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ items?: string; lang?: string }>;
}) {
  const { items: itemsParam, lang } = await searchParams;

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

  return (
    <BasketPage items={items} sharedParam={itemsParam ?? null} initialLang={coerceLang(lang)} />
  );
}
