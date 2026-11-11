/**
 * Карта сайта для поисковиков: /sitemap.xml.
 * Собирается из контента: каждая страница на каждом языке, где у неё есть текст,
 * с адресами на других языках (hreflang). Новая страница попадает сюда сама.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from '@/i18n/config';
import { localizedPath, splitEntryId } from '@/i18n/utils';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://smartsol.pro');
  const abs = (path: string) => new URL(path, base).href;

  // Путь страницы без языка → языки, на которых она есть
  const routes = new Map<string, Set<Locale>>();
  for (const entry of await getCollection('pages', ({ data }) => !data.draft)) {
    const { locale, slug } = splitEntryId(entry.id);
    const path = slug === 'home' ? '' : slug;
    if (!routes.has(path)) routes.set(path, new Set());
    routes.get(path)!.add(locale);
  }

  const urls: string[] = [];
  for (const [path, set] of routes) {
    const locales = LOCALES.filter((l) => set.has(l));
    const links =
      locales.length > 1
        ? [
            ...locales.map(
              (l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[l].lang}" href="${abs(localizedPath(l, path))}"/>`,
            ),
            ...(set.has(DEFAULT_LOCALE)
              ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(localizedPath(DEFAULT_LOCALE, path))}"/>`]
              : []),
          ]
        : [];
    for (const locale of locales) {
      urls.push(['  <url>', `    <loc>${abs(localizedPath(locale, path))}</loc>`, ...links, '  </url>'].join('\n'));
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
