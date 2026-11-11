/**
 * Цели аналитики. Счётчики (Яндекс Метрика, Meta Pixel) подключаются на этапе 4
 * и только если заданы их ID — до этого функции просто ничего не делают.
 *
 * Цели:
 *   lead_submit    — отправлена форма заявки
 *   whatsapp_click — клик по ссылке на WhatsApp
 *   phone_click    — клик по телефону
 */
export type Goal = 'lead_submit' | 'whatsapp_click' | 'phone_click';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    /** ID Метрики — выставляется скриптом счётчика на этапе 4 */
    __ymId?: number;
  }
}

export function trackGoal(goal: Goal, params: Record<string, string> = {}): void {
  try {
    if (window.__ymId && typeof window.ym === 'function') {
      window.ym(window.__ymId, 'reachGoal', goal, params);
    }
  } catch {
    /* счётчик не должен ломать сайт */
  }
  try {
    if (typeof window.fbq === 'function') {
      if (goal === 'lead_submit') window.fbq('track', 'Lead', params);
      else window.fbq('track', 'Contact', { method: goal === 'phone_click' ? 'phone' : 'whatsapp' });
    }
  } catch {
    /* счётчик не должен ломать сайт */
  }
  if (import.meta.env.DEV) console.info('[цель]', goal, params);
}

/** Клики по WhatsApp и телефону — один обработчик на весь документ */
export function initGoalTracking(): void {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const place = link.dataset.place ?? '';
      if (href.startsWith('https://wa.me/')) trackGoal('whatsapp_click', { place });
      else if (href.startsWith('tel:')) trackGoal('phone_click', { place });
    },
    { capture: true },
  );
}
