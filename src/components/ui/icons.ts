/**
 * Линейные иконки SmartSol: сетка 24×24, линия 2 px, скруглённые концы
 * (брендбук: «иконки — линейные, линия 2–3 px, скругления»).
 * Рисуем сами, без библиотек. Цвет берётся из currentColor.
 */
export const ICONS = {
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  'menu': '<path d="M4 8h16M4 16h16"/>',
  'close': '<path d="M6 6l12 12M18 6 6 18"/>',
  'plus': '<path d="M12 5v14M5 12h14"/>',
  'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  'whatsapp':
    '<path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.3-4.25A8.5 8.5 0 1 1 20.5 11.8z"/><path d="M9.3 8.4c.6-.4 1.3-.3 1.6.3l.5 1.1c.2.4.1.8-.2 1.1l-.5.5c.6 1.2 1.5 2.1 2.7 2.7l.5-.5c.3-.3.7-.4 1.1-.2l1.1.5c.6.3.7 1 .3 1.6-.6.9-1.8 1.2-2.9.8a8.6 8.6 0 0 1-5-5c-.4-1.1-.1-2.3.8-2.9z" stroke-width="1.6"/>',
  'phone':
    '<path d="M5.2 3.5h3l1.6 4.2-2.1 1.5a11 11 0 0 0 7.1 7.1l1.5-2.1 4.2 1.6v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1z"/>',
  'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
  'instagram':
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" stroke="none"/>',
  'at': '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
  'map-pin': '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',

  // Продукты
  'bag': '<path d="M5 8h14l-1.1 12.1a1 1 0 0 1-1 .9H7.1a1 1 0 0 1-1-.9L5 8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  'box': '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.4 4.5"/>',
  'document':
    '<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  'pulse': '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
  'calendar':
    '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2"/>',

  // Направления и преимущества
  'nodes':
    '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.5 6h7M7.3 8.2l3.4 7.6M16.7 8.2l-3.4 7.6"/>',
  'megaphone': '<path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  'tenge': '<path d="M6 5h12M6 9.5h12M12 9.5V20"/>',
  'braces':
    '<path d="M9 4C7 4 6 5 6 7v2c0 1.5-.8 2.5-2 3 1.2.5 2 1.5 2 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 1.5.8 2.5 2 3-1.2.5-2 1.5-2 3v2c0 2-1 3-3 3"/>',
  'deadline': '<path d="M3 12h12M10 7l5 5-5 5M20 5v14"/>',
  'flow': '<rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M6.5 10v4.5a2 2 0 0 0 2 2H14"/>',
  'chart': '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  'bot': '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M2 13v2M22 13v2"/>',
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as [IconName, ...IconName[]];
