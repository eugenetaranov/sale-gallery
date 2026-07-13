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
  },
  RU: {
    headerTitle: "Продажа",
    items: "товаров",
    searchPlaceholder: "Поиск по названию…",
    sortPriceAsc: "Цена ↑",
    sortPriceDesc: "Цена ↓",
    sortName: "Название А–Я",
    clear: "очистить",
    noResults: "Нет товаров по этому фильтру.",
    language: "Язык",
    copyLink: "Копировать ссылку",
    linkCopied: "Ссылка скопирована!",
    noDescription: "Без описания.",
    productSheet: "Страница товара",
  },
};

export function t(lang: Lang): UIStrings {
  return STRINGS[lang] ?? STRINGS.ES;
}
