// Языки сайта. Порядок совпадает с порядком в переключателе языка.
// Сокращение в адресе — kz, но код языка для браузеров и поисковиков — kk.
export const LOCALES = ['ru', 'kz', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

interface LocaleMeta {
  /** Подпись в переключателе */
  label: string;
  /** Название языка на самом языке — для подсказок и экранных читалок */
  name: string;
  /** Значение <html lang> и атрибута hreflang */
  lang: string;
  /** og:locale */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ru: { label: 'RU', name: 'Русский', lang: 'ru', ogLocale: 'ru_RU' },
  kz: { label: 'KZ', name: 'Қазақша', lang: 'kk', ogLocale: 'kk_KZ' },
  en: { label: 'EN', name: 'English', lang: 'en', ogLocale: 'en_US' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
