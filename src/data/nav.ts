import type { UiKey } from '@/i18n/ui';

/** Пункты главного меню и подвала. path — без языка и слешей: 'services' → /services/ */
export const NAV: { key: UiKey; path: string }[] = [
  { key: 'nav.services', path: 'services' },
  { key: 'nav.products', path: 'products' },
  { key: 'nav.finpulse', path: 'products/finpuls' },
  { key: 'nav.cases', path: 'cases' },
  { key: 'nav.contacts', path: 'contacts' },
];
