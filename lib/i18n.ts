// UI-chrome translations (labels/placeholders). Item data (Kind, Condition,
// Status, marketplace names) stays as stored in Airtable.

import type { Lang } from "@/lib/airtable";

export type UIStrings = {
  headerTitle: string;
  items: string;
  searchPlaceholder: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortName: string;
  clear: string;
  noResults: string;
  language: string;
  copyLink: string;
  linkCopied: string;
  noDescription: string;
  productSheet: string;
  exportPdf: string;
  free: string;
  basket: string;
  basketTitle: string;
  addToBasket: string;
  inBasket: string;
  basketEmpty: string;
  total: string;
  remove: string;
  clearBasket: string;
  viewBasket: string;
  basketShareHint: string;
  noLongerAvailable: string;
  someUnavailable: string;
};

const STRINGS: Record<Lang, UIStrings> = {
  ES: {
    headerTitle: "En venta",
    items: "artículos",
    searchPlaceholder: "Buscar por nombre…",
    sortPriceAsc: "Precio ↑",
    sortPriceDesc: "Precio ↓",
    sortName: "Nombre A–Z",
    clear: "limpiar",
    noResults: "No hay artículos que coincidan con el filtro.",
    language: "Idioma",
    copyLink: "Copiar enlace",
    linkCopied: "¡Enlace copiado!",
    noDescription: "Sin descripción.",
    productSheet: "Ficha del producto",
    exportPdf: "Descargar PDF",
    free: "Gratis",
    basket: "Cesta",
    basketTitle: "Mi cesta",
    addToBasket: "Añadir a la cesta",
    inBasket: "En la cesta",
    basketEmpty: "Tu cesta está vacía.",
    total: "Total",
    remove: "Quitar",
    clearBasket: "Vaciar",
    viewBasket: "Ver cesta completa",
    basketShareHint: "Comparte este enlace para decirnos qué artículos te interesan.",
    noLongerAvailable: "Ya no disponible",
    someUnavailable: "artículo(s) ya no disponible(s)",
  },
  EN: {
    headerTitle: "For sale",
    items: "items",
    searchPlaceholder: "Search by name…",
    sortPriceAsc: "Price ↑",
    sortPriceDesc: "Price ↓",
    sortName: "Name A–Z",
    clear: "clear",
    noResults: "No items match the filter.",
    language: "Language",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    noDescription: "No description.",
    productSheet: "Product page",
    exportPdf: "Download PDF",
    free: "Free",
    basket: "Basket",
    basketTitle: "My basket",
    addToBasket: "Add to basket",
    inBasket: "In basket",
    basketEmpty: "Your basket is empty.",
    total: "Total",
    remove: "Remove",
    clearBasket: "Clear",
    viewBasket: "View full basket",
    basketShareHint: "Share this link to tell us which items you're interested in.",
    noLongerAvailable: "No longer available",
    someUnavailable: "item(s) no longer available",
  },
  UA: {
    headerTitle: "Продаж",
    items: "товарів",
    searchPlaceholder: "Пошук за назвою…",
    sortPriceAsc: "Ціна ↑",
    sortPriceDesc: "Ціна ↓",
    sortName: "Назва А–Я",
    clear: "очистити",
    noResults: "Немає товарів за цим фільтром.",
    language: "Мова",
    copyLink: "Копіювати посилання",
    linkCopied: "Посилання скопійовано!",
    noDescription: "Без опису.",
    productSheet: "Сторінка товару",
    exportPdf: "Завантажити PDF",
    free: "Безкоштовно",
    basket: "Кошик",
    basketTitle: "Мій кошик",
    addToBasket: "Додати до кошика",
    inBasket: "У кошику",
    basketEmpty: "Ваш кошик порожній.",
    total: "Разом",
    remove: "Прибрати",
    clearBasket: "Очистити",
    viewBasket: "Переглянути кошик",
    basketShareHint: "Поділіться цим посиланням, щоб повідомити, які товари вас цікавлять.",
    noLongerAvailable: "Більше недоступно",
    someUnavailable: "товар(и) більше недоступні",
  },
};

export function t(lang: Lang): UIStrings {
  return STRINGS[lang] ?? STRINGS.ES;
}

// Translations for Airtable single-select values (Kind / Condition / Status).
// Keys are the canonical English values stored in Airtable — filtering still
// happens on the raw value, only the displayed label is localized. Unknown
// values fall back to the raw string so new choices never break the UI.
type Dict = Record<Lang, string>;

const KINDS: Record<string, Dict> = {
  Furniture: { ES: "Muebles", EN: "Furniture", UA: "Меблі" },
  Electronics: { ES: "Electrónica", EN: "Electronics", UA: "Електроніка" },
  "Home appliance": {
    ES: "Electrodomésticos",
    EN: "Home appliance",
    UA: "Побутова техніка",
  },
  Lighting: { ES: "Iluminación", EN: "Lighting", UA: "Освітлення" },
  "Kitchen/Camping": {
    ES: "Cocina/Camping",
    EN: "Kitchen/Camping",
    UA: "Кухня/Кемпінг",
  },
  "Computer/Peripherals": {
    ES: "Ordenador/Periféricos",
    EN: "Computer/Peripherals",
    UA: "Комп'ютер/Периферія",
  },
  Tools: { ES: "Herramientas", EN: "Tools", UA: "Інструменти" },
  "Rugs/Textiles": {
    ES: "Alfombras/Textil",
    EN: "Rugs/Textiles",
    UA: "Килими/Текстиль",
  },
  Vehicle: { ES: "Vehículo", EN: "Vehicle", UA: "Транспорт" },
  Other: { ES: "Otros", EN: "Other", UA: "Інше" },
};

const CONDITIONS: Record<string, Dict> = {
  "New/sealed": {
    ES: "Nuevo/precintado",
    EN: "New/sealed",
    UA: "Нове/запечатане",
  },
  "Like new": { ES: "Como nuevo", EN: "Like new", UA: "Як нове" },
  Good: { ES: "Bueno", EN: "Good", UA: "Добрий стан" },
  Fair: { ES: "Aceptable", EN: "Fair", UA: "Задовільний" },
};

const STATUSES: Record<string, Dict> = {
  Draft: { ES: "Borrador", EN: "Draft", UA: "Чернетка" },
  Ready: { ES: "Listo", EN: "Ready", UA: "Готово" },
  Listed: { ES: "Publicado", EN: "Listed", UA: "Опубліковано" },
  Reserved: { ES: "Reservado", EN: "Reserved", UA: "Зарезервовано" },
  Sold: { ES: "Vendido", EN: "Sold", UA: "Продано" },
  "Given away": { ES: "Regalado", EN: "Given away", UA: "Віддано" },
  Kept: { ES: "Conservado", EN: "Kept", UA: "Залишено" },
};

function translate(map: Record<string, Dict>, value: string, lang: Lang): string {
  return map[value]?.[lang] ?? value;
}

export const tKind = (value: string, lang: Lang): string => translate(KINDS, value, lang);
export const tCondition = (value: string, lang: Lang): string =>
  translate(CONDITIONS, value, lang);
export const tStatus = (value: string, lang: Lang): string => translate(STATUSES, value, lang);
