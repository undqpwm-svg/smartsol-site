/**
 * Картинки для соцсетей и иконки сайта — рисуем из HTML через Playwright.
 *
 *   npm run assets
 *
 * Что получается в public/:
 *   og.png, og-kz.png, og-en.png — превью ссылки в соцсетях и мессенджерах (1200×630)
 *   apple-touch-icon.png         — иконка на экране iPhone (180×180)
 *   favicon-32.png               — запасная иконка для старых браузеров
 *
 * Тексты превью — ниже, в OG. Поменяли текст — запустите скрипт ещё раз.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (name) => join(root, 'public', name);
const font = (family, subset, weight) =>
  pathToFileURL(join(root, 'node_modules/@fontsource', family, 'files', `${family}-${subset}-${weight}-normal.woff2`)).href;

const logo = readFileSync(pub('brand/smartsol-logo.svg'), 'utf8');
const icon = readFileSync(pub('brand/smartsol-icon.svg'), 'utf8');

/** Заголовок первого экрана и направления. [[…]] — выделение, как на сайте */
const OG = {
  og: {
    lang: 'ru',
    title: 'Делаем сложное [[простым]]',
    tags: ['1С', 'Интеграции', 'Сайты и приложения', 'Боты', 'Маркетинг', 'ФинПульс'],
    foot: 'smartsol.pro · удалённо по всему Казахстану',
  },
  'og-kz': {
    lang: 'kk',
    title: 'Күрделіні [[қарапайым]] етеміз',
    tags: ['1С', 'Интеграциялар', 'Сайттар мен қосымшалар', 'Боттар', 'Маркетинг', 'ФинПульс'],
    foot: 'smartsol.pro · бүкіл Қазақстан бойынша қашықтан',
  },
  'og-en': {
    lang: 'en',
    title: 'We make the complex [[simple]]',
    tags: ['1C', 'Integrations', 'Websites and apps', 'Bots', 'Marketing', 'FinPulse'],
    foot: 'smartsol.pro · remotely across Kazakhstan',
  },
};

const fontFaces = ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext']
  .flatMap((subset) => [
    `@font-face{font-family:Geologica;font-weight:800;src:url(${font('geologica', subset, 800)}) format('woff2')}`,
    `@font-face{font-family:Onest;font-weight:500;src:url(${font('onest', subset, 500)}) format('woff2')}`,
  ])
  .join('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const mark = (s) => esc(s).replace(/\[\[(.+?)\]\]/g, '<mark>$1</mark>');

function ogHtml({ lang, title, tags, foot }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
${fontFaces}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{background:#F4F1EA;color:#141414;font-family:Onest,sans-serif;position:relative;overflow:hidden}
.logo{position:absolute;left:72px;top:64px;width:250px}
.logo svg{width:100%;height:auto;display:block}
h1{position:absolute;left:72px;right:250px;top:190px;font-family:Geologica,sans-serif;font-weight:800;font-size:84px;line-height:1.04;letter-spacing:-0.025em}
mark{background:#FF5B2E;color:#141414;padding:0 .14em;border-radius:.16em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.tags{position:absolute;left:72px;right:230px;bottom:116px;display:flex;flex-wrap:wrap;gap:8px}
.tags span{font-weight:500;font-size:19px;padding:8px 15px;border-radius:999px;border:1.5px solid #141414}
.foot{position:absolute;left:72px;bottom:58px;font-weight:500;font-size:22px;color:#6B665C}
/* Фирменная линия: путь заявки справа сверху вниз, узлы — этапы */
.line{position:absolute;right:150px;top:0;bottom:0;width:4px;background:#141414}
.node{position:absolute;right:138px;width:28px;height:28px;border-radius:50%;background:#F4F1EA;border:4px solid #141414}
.node.on{background:#FF5B2E;border-color:#141414}
.dot{position:absolute;right:122px;bottom:84px;width:60px;height:60px;border-radius:50%;background:#FF5B2E}
</style></head><body>
<div class="logo">${logo}</div>
<h1>${mark(title)}</h1>
<div class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
<p class="foot">${esc(foot)}</p>
<div class="line"></div>
<div class="node" style="top:120px"></div>
<div class="node" style="top:228px"></div>
<div class="node on" style="top:336px"></div>
<div class="dot"></div>
</body></html>`;
}

const iconHtml = (size, pad) => `<!doctype html><html><head><style>
*{margin:0;padding:0}html,body{width:${size}px;height:${size}px;background:${pad ? '#141414' : 'transparent'}}
svg{display:block;width:${size}px;height:${size}px}
</style></head><body>${icon}</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [name, data] of Object.entries(OG)) {
    // Страницу пишем во временный файл рядом, чтобы шрифты открылись по file://
    const tmp = join(root, 'node_modules', '.og-tmp.html');
    writeFileSync(tmp, ogHtml(data));
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: pub(`${name}.png`) });
    console.log(`public/${name}.png`);
  }

  // iPhone скругляет углы сам, поэтому иконка — квадрат без прозрачности
  for (const [file, size, opaque] of [
    ['apple-touch-icon.png', 180, true],
    ['favicon-32.png', 32, false],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(iconHtml(size, opaque));
    await page.screenshot({ path: pub(file), omitBackground: !opaque });
    console.log(`public/${file}`);
  }
} finally {
  await browser.close();
}
