// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Конфигурация сайта SmartSol (smartsol.pro)
export default defineConfig({
  site: 'https://smartsol.pro',

  // Все адреса со слешем на конце: /automation/, /kz/, /products/kaspi/.
  // GitHub Pages сам перенаправляет /automation → /automation/.
  // Публикация: npm run publish собирает сайт в папку docs/ (её отдаёт GitHub Pages).
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS встраивается в HTML: нет блокирующего запроса, быстрее первый экран
    inlineStylesheets: 'always',
  },

  // Встроенный i18n-роутинг Astro: русский по умолчанию без префикса,
  // казахский — /kz/ (код языка kk), английский — /en/.
  i18n: {
    locales: ['ru', { path: 'kz', codes: ['kk', 'kk-KZ'] }, 'en'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false },
  },

  // Astro 7 по умолчанию сжимает HTML как JSX и съедает пробелы между
  // строчными элементами («согласно<a>»). true — прежнее поведение.
  compressHTML: true,

  devToolbar: { enabled: false },

  // Сайт полностью статический: форма заявки уходит в Web3Forms прямо из браузера
  // (src/scripts/lead-form.ts), своего сервера нет.
  vite: {
    plugins: [tailwindcss()],
  },
});
