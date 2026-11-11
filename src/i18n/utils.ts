import { getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, type Locale } from './config';

/** Адрес страницы на нужном языке: localizedPath('kz', 'automation') → /kz/automation/ */
export function localizedPath(locale: Locale, path = ''): string {
  // Astro ждёт код языка из конфига (kk), а не путь (kz) — путь он подставит сам
  return getRelativeLocaleUrl(LOCALE_META[locale].lang, path.replace(/^\/+/, ''));
}

/** Параметр [...locale] для getStaticPaths: у русского префикса нет */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

/** Разбирает id записи коллекции вида «ru/kaspi» на язык и slug */
export function splitEntryId(id: string): { locale: Locale; slug: string } {
  const [first, ...rest] = id.split('/');
  if (!isLocale(first) || rest.length === 0) {
    throw new Error(
      `Файл контента «${id}» должен лежать в папке языка: ${LOCALES.join(', ')} (например, ru/${id}.md)`,
    );
  }
  return { locale: first, slug: rest.join('/') };
}

/**
 * Внутренние ссылки из контента ведут на страницы того же языка:
 * в казахском тексте «/pricing/» превращается в «/kz/pricing/».
 * Внешние ссылки, якоря, tel: и mailto: не меняются.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const firstSegment = href.split(/[/?#]/)[1];
  if (isLocale(firstSegment)) return href;
  const [pathPart, hash = ''] = href.split('#');
  const localized = localizedPath(locale, pathPart);
  return hash ? `${localized}#${hash}` : localized;
}

/** Набор адресов одной страницы на всех языках, где она есть */
export type Alternates = Partial<Record<Locale, string>>;

/** Строит адреса страницы для языков, на которых есть её контент */
export function buildAlternates(available: Iterable<Locale>, path = ''): Alternates {
  const result: Alternates = {};
  for (const locale of available) result[locale] = localizedPath(locale, path);
  return result;
}
