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
    exportPdf: "Скачать PDF",
    free: "Бесплатно",
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
  Furniture: { ES: "Muebles", EN: "Furniture", UA: "Меблі", RU: "Мебель" },
  Electronics: { ES: "Electrónica", EN: "Electronics", UA: "Електроніка", RU: "Электроника" },
  "Home appliance": {
    ES: "Electrodomésticos",
    EN: "Home appliance",
    UA: "Побутова техніка",
    RU: "Бытовая техника",
  },
  Lighting: { ES: "Iluminación", EN: "Lighting", UA: "Освітлення", RU: "Освещение" },
  "Kitchen/Camping": {
    ES: "Cocina/Camping",
    EN: "Kitchen/Camping",
    UA: "Кухня/Кемпінг",
    RU: "Кухня/Кемпинг",
  },
  "Computer/Peripherals": {
    ES: "Ordenador/Periféricos",
    EN: "Computer/Peripherals",
    UA: "Комп'ютер/Периферія",
    RU: "Компьютер/Периферия",
  },
  Tools: { ES: "Herramientas", EN: "Tools", UA: "Інструменти", RU: "Инструменты" },
  "Rugs/Textiles": {
    ES: "Alfombras/Textil",
    EN: "Rugs/Textiles",
    UA: "Килими/Текстиль",
    RU: "Ковры/Текстиль",
  },
  Vehicle: { ES: "Vehículo", EN: "Vehicle", UA: "Транспорт", RU: "Транспорт" },
  Other: { ES: "Otros", EN: "Other", UA: "Інше", RU: "Другое" },
};

const CONDITIONS: Record<string, Dict> = {
  "New/sealed": {
    ES: "Nuevo/precintado",
    EN: "New/sealed",
    UA: "Нове/запечатане",
    RU: "Новое/запечатано",
  },
  "Like new": { ES: "Como nuevo", EN: "Like new", UA: "Як нове", RU: "Как новое" },
  Good: { ES: "Bueno", EN: "Good", UA: "Добрий стан", RU: "Хорошее" },
  Fair: { ES: "Aceptable", EN: "Fair", UA: "Задовільний", RU: "Удовлетворительное" },
};

const STATUSES: Record<string, Dict> = {
  Draft: { ES: "Borrador", EN: "Draft", UA: "Чернетка", RU: "Черновик" },
  Ready: { ES: "Listo", EN: "Ready", UA: "Готово", RU: "Готово" },
  Listed: { ES: "Publicado", EN: "Listed", UA: "Опубліковано", RU: "Опубликовано" },
  Reserved: { ES: "Reservado", EN: "Reserved", UA: "Зарезервовано", RU: "Зарезервировано" },
  Sold: { ES: "Vendido", EN: "Sold", UA: "Продано", RU: "Продано" },
  "Given away": { ES: "Regalado", EN: "Given away", UA: "Віддано", RU: "Отдано" },
  Kept: { ES: "Conservado", EN: "Kept", UA: "Залишено", RU: "Оставлено" },
};

function translate(map: Record<string, Dict>, value: string, lang: Lang): string {
  return map[value]?.[lang] ?? value;
}

export const tKind = (value: string, lang: Lang): string => translate(KINDS, value, lang);
export const tCondition = (value: string, lang: Lang): string =>
  translate(CONDITIONS, value, lang);
export const tStatus = (value: string, lang: Lang): string => translate(STATUSES, value, lang);
