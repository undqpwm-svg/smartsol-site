/**
 * Откуда пришёл посетитель: UTM-метки, страница входа и внешний реферер.
 * Сохраняется в браузере на 30 дней и уходит вместе с заявкой — так видно,
 * какая реклама приводит клиентов. Персональных данных здесь нет.
 */
const KEY = 'ss_attribution';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'yclid',
] as const;

export interface Attribution {
  utm: Partial<Record<(typeof PARAMS)[number], string>>;
  landing: string;
  referrer: string;
  ts: number;
}

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Attribution;
    return Date.now() - data.ts > TTL_MS ? null : data;
  } catch {
    return null;
  }
}

/** Вызывается на каждой странице: новые метки перезаписывают старые */
export function captureAttribution(): void {
  try {
    const url = new URL(window.location.href);
    const utm: Attribution['utm'] = {};
    for (const name of PARAMS) {
      const value = url.searchParams.get(name);
      if (value) utm[name] = value.slice(0, 200);
    }
    const hasCampaign = Object.keys(utm).length > 0;
    const external = document.referrer && !document.referrer.startsWith(window.location.origin);
    if (!hasCampaign && read()) return;

    const data: Attribution = {
      utm,
      landing: window.location.href.slice(0, 500),
      referrer: external ? document.referrer.slice(0, 500) : '',
      ts: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* хранилище недоступно (приватный режим) — не страшно */
  }
}

export function getAttribution(): Attribution | null {
  return read();
}
