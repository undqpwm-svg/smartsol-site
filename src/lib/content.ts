import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { splitEntryId } from '@/i18n/utils';

export interface LocalizedCase {
  slug: string;
  /** Язык, на котором реально написан текст (может быть русским, если перевода нет) */
  locale: Locale;
  data: CollectionEntry<'cases'>['data'];
}

/**
 * Кейсы на нужном языке, по порядку (поле order). Если какого-то кейса
 * на этом языке ещё нет, подставляется русский — карточка не пропадает.
 * Черновики (draft: true) не показываются.
 */
export async function getLocalizedCases(locale: Locale): Promise<LocalizedCase[]> {
  const bySlug = new Map<string, LocalizedCase>();
  for (const entry of await getCollection('cases', ({ data }) => !data.draft)) {
    const { locale: entryLocale, slug } = splitEntryId(entry.id);
    if (entryLocale !== locale && entryLocale !== DEFAULT_LOCALE) continue;
    if (!bySlug.has(slug) || entryLocale === locale) {
      bySlug.set(slug, { slug, locale: entryLocale, data: entry.data });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.data.order - b.data.order);
}
