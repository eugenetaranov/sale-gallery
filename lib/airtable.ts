// Server-only Airtable REST client + normalization for the Items table.
// Photo (attachment) URLs from Airtable are signed and expire ~2h, so callers
// must refetch periodically (the page sets `revalidate = 600`).

export type Lang = "ES" | "EN" | "UA" | "RU";
export const LANGS: Lang[] = ["ES", "EN", "UA", "RU"];

export type Photo = { small: string; large: string; full: string };

export type Item = {
  id: string;
  name: string; // primary (ES / Wallapop) title
  names: Record<Lang, string>;
  kind: string;
  status: string;
  condition: string;
  targetPrice: number | null;
  photos: Photo[];
  descriptions: Record<Lang, string>;
  links: {
    product?: string;
    wallapop?: string;
    milanuncios?: string;
    facebook?: string;
    telegram?: string;
  };
  marketplace: string[];
};

// Field IDs (names contain spaces/parens, so we address by ID via
// returnFieldsByFieldId=true). Only buyer-facing fields are requested —
// Retail price / Loss / Recovery % / Notes / Local folder are never fetched.
const F = {
  name: "fldkEiBgfp01GTROH",
  nameEN: "fld1GEOu1GVfKc57S",
  nameUK: "fldziLsekjTvseWOa",
  nameRU: "fldRxriZ3uXph5RZ5",
  kind: "fldhi7tp2bOsC7O3W",
  status: "fldzxbJZltMhThPbB",
  photos: "fld3JH9SvJCNlUicj",
  condition: "fldFVsUxZrUoHEqCF",
  target: "fldooSbJ6VWezwYJw",
  descES: "fldOx3aJNhK58VLIn",
  descEN: "fld2U6RpYnMmuAyVX",
  descUK: "fldzoPbvMZQxg4Wno",
  descRU: "fldZqO2BT92cQvwGF",
  marketplace: "fld6IiH7p5CZrnTiX",
  productUrl: "fldRdmtyZwcSvZBwf",
  wallapop: "fldO358VelVFttUpl",
  milanuncios: "fldsNsqWG9MqF7VMi",
  facebook: "fldHTMnWThGMUIJ9Y",
  telegram: "fldkIt0AShUE8BD2H",
} as const;

const REQUEST_FIELDS = Object.values(F);

type AirtableAttachment = {
  url: string;
  filename?: string;
  thumbnails?: {
    small?: { url: string };
    large?: { url: string };
    full?: { url: string };
  };
};

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

function str(v: unknown): string {
  if (typeof v === "string") return v;
  // singleSelect values come back as { id, name, color }
  if (v && typeof v === "object" && "name" in v) return String((v as { name: unknown }).name ?? "");
  return "";
}

function normalizePhotos(v: unknown): Photo[] {
  if (!Array.isArray(v)) return [];
  return (v as AirtableAttachment[]).map((a) => {
    const small = a.thumbnails?.small?.url ?? a.url;
    const large = a.thumbnails?.large?.url ?? a.url;
    return { small, large, full: a.url };
  });
}

function normalizeMarketplace(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => str(x)).filter(Boolean);
}

function undefIfEmpty(v: unknown): string | undefined {
  const s = str(v);
  return s ? s : undefined;
}

function toItem(rec: AirtableRecord): Item {
  const f = rec.fields;
  const rawTarget = f[F.target];
  const esName = str(f[F.name]);
  return {
    id: rec.id,
    name: esName,
    names: {
      ES: esName,
      EN: str(f[F.nameEN]),
      UA: str(f[F.nameUK]), // Airtable field is "Name (UK)"; displayed as UA
      RU: str(f[F.nameRU]),
    },
    kind: str(f[F.kind]),
    status: str(f[F.status]),
    condition: str(f[F.condition]),
    targetPrice: typeof rawTarget === "number" ? rawTarget : null,
    photos: normalizePhotos(f[F.photos]),
    descriptions: {
      ES: str(f[F.descES]),
      EN: str(f[F.descEN]),
      UA: str(f[F.descUK]), // Airtable field is "Description (UK)"; displayed as UA
      RU: str(f[F.descRU]),
    },
    links: {
      product: undefIfEmpty(f[F.productUrl]),
      wallapop: undefIfEmpty(f[F.wallapop]),
      milanuncios: undefIfEmpty(f[F.milanuncios]),
      facebook: undefIfEmpty(f[F.facebook]),
      telegram: undefIfEmpty(f[F.telegram]),
    },
    marketplace: normalizeMarketplace(f[F.marketplace]),
  };
}

/**
 * Fetch all Items (paginated) from Airtable and normalize them.
 * Returns every record regardless of Status — the client toolbar defaults to
 * showing only Ready + Listed but can widen to all without a refetch.
 */
export async function getItems(): Promise<Item[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;

  if (!token || !baseId || !tableId) {
    throw new Error(
      "Missing Airtable env vars. Copy .env.local.example to .env.local and set AIRTABLE_TOKEN (see README)."
    );
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    params.set("pageSize", "100");
    params.set("returnFieldsByFieldId", "true");
    for (const fid of REQUEST_FIELDS) params.append("fields[]", fid);
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      // ISR: refetch every 10 min so signed photo URLs stay valid.
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Airtable request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    records.push(...json.records);
    offset = json.offset;
  } while (offset);

  return records.map(toItem);
}

/** Display title for the chosen language, falling back to the ES/primary name. */
export function nameFor(item: Item, lang: Lang): string {
  return item.names[lang] || item.names.ES || item.name;
}
