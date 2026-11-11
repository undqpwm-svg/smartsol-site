/**
 * Контакты SmartSol — меняются здесь, на всём сайте сразу.
 * Адреса нет: работаем удалённо по всему Казахстану.
 * Реквизитов на сайте пока нет — ни в подвале, ни в политике данных.
 */
export const SITE = {
  name: 'SmartSol',
  url: 'https://smartsol.pro',

  /** Основной номер: шапка, подвал, панель WhatsApp на телефоне, звонок */
  phone: {
    /** Для ссылок tel: и wa.me — только цифры с кодом страны */
    digits: '77715469868',
    /** Как показываем на сайте */
    display: '+7 771 546 98 68',
  },
  /** Все номера WhatsApp — на странице контактов */
  whatsapp: [
    { digits: '77715469868', display: '+7 771 546 98 68' },
    { digits: '77081886356', display: '+7 708 188 63 56' },
  ],
  email: 'help@smartsol.pro',
  instagram: { handle: '@smart.sol.kz', url: 'https://www.instagram.com/smart.sol.kz/' },
  threads: { handle: '@smart.sol.kz', url: 'https://www.threads.com/@smart.sol.kz' },

  /** Демо приложения ФинПульс */
  finpulseDemo: 'https://finpulse.smartsol.pro',

} as const;

/** Ссылка на WhatsApp с готовым текстом сообщения */
export function whatsappUrl(text?: string, digits: string = SITE.phone.digits): string {
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const phoneHref = `tel:+${SITE.phone.digits}`;
export const emailHref = `mailto:${SITE.email}`;
