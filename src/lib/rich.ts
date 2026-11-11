import type { Locale } from '@/i18n/config';
import { localizeHref } from '@/i18n/utils';

/**
 * Мини-разметка для текстов из контента (без внешних библиотек).
 * Поддерживает: [[плашка]], **жирный**, [текст](ссылка), [TODO: …].
 * Всё остальное экранируется — HTML из контента не попадает на страницу.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

const NBSP = ' ';

/**
 * Типографика: короткие слова (в, и, с, на, по…) не остаются в конце строки,
 * тире не переносится в начало следующей строки, «№» и «§» не отрываются от числа,
 * короткие окончания через дефис (казахские -қа, -те) не уходят на новую строку.
 */
export function typograph(value: string): string {
  return (
    value
      // Ретроспективная проверка (?<=…) не «съедает» пробел перед словом,
      // поэтому цепочки «а в», «и с» склеиваются за один проход
      .replace(/(?<=^|[\s(«„"])([а-яёәғқңөұүһіa-z]{1,2})\s+(?=\S)/giu, `$1${NBSP}`)
      .replace(/\s+([—–])\s/g, `${NBSP}$1 `)
      .replace(/([№§])\s+(?=\d)/g, `$1${NBSP}`)
      // Короткое окончание через дефис не отрывается от слова: «WhatsApp-қа», «1С-те»
      .replace(/(?<=[\p{L}\d])-(?=\p{L}{1,4}(?!\p{L}))/gu, '-⁠')
      // Суммы: «24 900 ₸» не разрывается ни между разрядами, ни перед знаком тенге
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
      .replace(/(\d) (?=₸)/g, `$1${NBSP}`)
  );
}

export interface RichOptions {
  locale: Locale;
  /** Разрешить коралловую плашку [[…]] (только заголовки) */
  mark?: boolean;
}

function inline(escaped: string, opts: RichOptions): string {
  return escaped
    // Пометки «нужны данные» — обычным текстом, атрибут только для поиска
    .replace(/\[TODO:([^\]]*)\]/g, (_, note: string) => `<span class="todo" data-todo>[TODO:${note}]</span>`)
    .replace(/\[\[([^\]]+)\]\]/g, (_, word: string) =>
      opts.mark ? `<span class="mark">${word}</span>` : word,
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Строка с мини-разметкой → безопасный HTML (одна строка, без абзацев) */
export function renderRich(source: string, opts: RichOptions): string {
  // Ссылки вынимаем до экранирования, чтобы корректно обработать адрес
  const links: string[] = [];
  const withPlaceholders = source.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, label: string, href: string) => {
      const target = localizeHref(href, opts.locale);
      const external = /^https?:\/\//.test(target) && !target.startsWith('https://smartsol.pro');
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      links.push(`<a href="${escapeHtml(target)}"${attrs}>${inline(typograph(escapeHtml(label)), opts)}</a>`);
      return `\u0000${links.length - 1}\u0000`;
    },
  );

  return inline(typograph(escapeHtml(withPlaceholders)), opts).replace(
    /\u0000(\d+)\u0000/g,
    (_, i: string) => links[Number(i)],
  );
}

/** Текст с абзацами (пустая строка между ними) → <p>…</p><p>…</p> */
export function renderRichBlock(source: string, opts: RichOptions): string {
  return source
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${renderRich(para.replace(/\s*\n\s*/g, ' '), opts)}</p>`)
    .join('');
}

/** Убирает разметку — для title, alt, aria-label и JSON-LD */
export function plainText(source: string): string {
  return source
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1');
}
