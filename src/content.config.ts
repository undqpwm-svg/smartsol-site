import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Схемы контента. Каждая папка коллекции разбита по языкам:
 *   src/content/pages/ru/services.md
 *   src/content/pages/kz/services.md   ← тот же адрес, другой язык
 * Если файл заполнен с ошибкой, сборка остановится и покажет, какое поле не так.
 *
 * В текстах можно использовать:
 *   [[слово]]            — коралловая плашка (только в заголовках, одна на экран)
 *   **жирный**           — выделение
 *   [текст](/services/)  — ссылка; внутренние ссылки сами получают префикс языка
 *   [TODO: …]            — нужны данные; список всех пометок: npm run todo
 */

const text = z.string().trim().min(1);
const anchor = z.string().regex(/^[a-z0-9-]+$/, 'id — латиница, цифры и дефис');

const seo = z.object({
  /** <title>: до ~60 символов, ключевая фраза в начале */
  title: text.max(90),
  /** meta description: 120–160 символов */
  description: text.max(220),
});

/** Ссылка или кнопка. Адрес на http(s) открывается в новой вкладке */
const link = z.object({ label: text, href: text });

// ── Блоки ────────────────────────────────────────────────────

/** Первый экран главной */
const heroBlock = z.object({
  type: z.literal('hero'),
  title: text,
  lead: text,
  /** Главная кнопка — к форме */
  primary: link,
  /** Вторая кнопка «Написать в WhatsApp» */
  whatsapp: z.boolean().default(true),
  /** Мелкая строка под кнопками */
  note: text.optional(),
});

/** Направления на линии: название у линии слева, описание справа, строка — ссылка */
const servicesBlock = z.object({
  type: z.literal('services'),
  id: anchor.optional(),
  title: text,
  lead: text.optional(),
  items: z.array(z.object({ title: text, text: text, href: text })).min(1),
});

/** Крупный блок-акцент (продукт): тёмная полоса с кнопками */
const featureBlock = z.object({
  type: z.literal('feature'),
  id: anchor.optional(),
  /** Подпись-капсула на линии */
  node: text.optional(),
  eyebrow: text.optional(),
  title: text,
  text: text,
  links: z.array(link).default([]),
  /** Схематичная иллюстрация рядом с текстом: calendar — платёжный календарь */
  visual: z.enum(['calendar']).optional(),
});

/** Карточки: короткие плашки, преимущества, возможности продукта */
const cardsBlock = z.object({
  type: z.literal('cards'),
  id: anchor.optional(),
  title: text,
  lead: text.optional(),
  /** Номера у карточек: 01, 02… */
  numbered: z.boolean().default(false),
  items: z
    .array(
      z.object({
        title: text,
        text: text.optional(),
        /** Вся карточка — ссылка */
        href: text.optional(),
        /** Кнопка внутри карточки */
        link: link.optional(),
      }),
    )
    .min(1),
  /** Ссылка под карточками */
  all: link.optional(),
});

/** Шаги работы — узлы на линии по порядку */
const stepsBlock = z.object({
  type: z.literal('steps'),
  id: anchor.optional(),
  title: text,
  lead: text.optional(),
  items: z.array(z.object({ title: text, text: text })).min(2),
});

/** Кейсы из src/content/cases/<язык>/ */
const casesBlock = z.object({
  type: z.literal('cases'),
  id: anchor.optional(),
  /** Без заголовка — когда он уже есть в шапке страницы */
  title: text.optional(),
  lead: text.optional(),
  /** slug-и по порядку; пусто — все кейсы */
  items: z.array(anchor).default([]),
  /** Коротко: отрасль и результат, ссылка на страницу кейсов. Иначе — задача, решение, результат */
  compact: z.boolean().default(false),
  all: link.optional(),
  note: text.optional(),
});

/** Услуги и продукты разделами: описание, список, «Что получите» */
const offersBlock = z.object({
  type: z.literal('offers'),
  id: anchor.optional(),
  title: text.optional(),
  items: z
    .array(
      z.object({
        /** Якорь раздела: /services/#integrations */
        id: anchor,
        title: text,
        /** Абзацы через пустую строку */
        text: text,
        list: z.array(z.object({ title: text.optional(), text: text })).default([]),
        /** «Что получите: …», «Результат: …» */
        result: z.object({ label: text, text: text }).optional(),
      }),
    )
    .min(1),
});

/** Строка-призыв: «Стоимость — после бесплатного разбора задачи» и кнопка */
const noteBlock = z.object({
  type: z.literal('note'),
  id: anchor.optional(),
  text: text,
  cta: link.optional(),
});

/** Заголовок и текст с абзацами */
const textBlock = z.object({
  type: z.literal('text'),
  id: anchor.optional(),
  title: text,
  text: text,
});

const faqBlock = z.object({
  type: z.literal('faq'),
  id: anchor.optional(),
  title: text,
  items: z.array(z.object({ q: text, a: text })).min(1),
});

/** Форма заявки: на главной — конец линии, на остальных страницах — финальная точка */
const leadBlock = z.object({
  type: z.literal('lead'),
  id: anchor.optional(),
  title: text,
  lead: text.optional(),
  /** Тема заявки — приходит в письме строкой «Тема» */
  topic: text.optional(),
});

/** Каналы связи — данные из src/data/site.ts */
const contactsBlock = z.object({
  type: z.literal('contacts'),
  id: anchor.optional(),
  title: text,
  note: text.optional(),
});

/** Текст из тела Markdown-файла страницы (политика и т. п.) */
const proseBlock = z.object({
  type: z.literal('prose'),
  id: anchor.optional(),
});

const block = z.discriminatedUnion('type', [
  heroBlock,
  servicesBlock,
  featureBlock,
  cardsBlock,
  stepsBlock,
  casesBlock,
  offersBlock,
  noteBlock,
  textBlock,
  faqBlock,
  leadBlock,
  contactsBlock,
  proseBlock,
]);

/** Шапка внутренней страницы: крошки строятся сами */
const pageHeader = z.object({
  title: text,
  lead: text.optional(),
  /** Подпись в хлебных крошках, если отличается от заголовка */
  crumb: text.optional(),
  /** Кнопка к форме; пусто — без кнопки */
  cta: text.optional(),
  /** Дополнительная кнопка: «Посмотреть демо» */
  extra: link.optional(),
});

export type PageBlock = z.infer<typeof block>;

// ── Коллекции ────────────────────────────────────────────────

/**
 * Страницы сайта. Адрес = путь файла без языка:
 *   pages/ru/home.md              → /
 *   pages/ru/services.md          → /services/
 *   pages/ru/products/finpuls.md  → /products/finpuls/
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    seo,
    draft: z.boolean().default(false),
    /** Шапка внутренней страницы (у главной её нет — там первый экран) */
    header: pageHeader.optional(),
    blocks: z.array(block).default([]),
  }),
});

/** Кейсы: отрасль → задача → что сделали → результат. Названия клиентов не пишем */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    industry: text,
    task: text,
    solution: text,
    result: text,
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, cases };
