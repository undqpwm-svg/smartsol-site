/**
 * Проверка сайта перед публикацией и после неё.
 *
 *   npm run test:site                          — собранный сайт локально (сначала npm run build && npm run preview)
 *   npm run test:site -- https://smartsol.pro  — опубликованный сайт
 *
 * Берёт все адреса из sitemap.xml и открывает каждый на iPhone 13 и на десктопе (1440 px).
 * Ищет: ошибки в консоли, ошибки JS, запросы с ответом 4xx/5xx,
 * горизонтальную прокрутку, страницы без <h1>, title или description.
 * Код выхода 1, если что-то нашлось.
 */
import { chromium, devices } from 'playwright';

const base = (process.argv[2] ?? 'http://localhost:4321').replace(/\/+$/, '');

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
paths.push('/404-proverka/'); // несуществующий адрес: должна открыться страница 404
if (paths.length < 2) {
  console.error(`Не нашёл адресов в ${base}/sitemap.xml`);
  process.exit(1);
}

const profiles = [
  { name: 'iPhone 13', options: devices['iPhone 13'] },
  { name: 'Десктоп', options: { viewport: { width: 1440, height: 900 } } },
];

const problems = [];
/** Внутренние ссылки со всех страниц — проверим, что каждая открывается */
const links = new Set();
const browser = await chromium.launch();

for (const profile of profiles) {
  const context = await browser.newContext(profile.options);
  const page = await context.newPage();
  let current = '';
  page.on('console', (msg) => {
    const expected404 = current === '/404-proverka/' && msg.text().includes('404');
    if (msg.type() === 'error' && !expected404) problems.push(`${profile.name} ${current}: консоль — ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`${profile.name} ${current}: ошибка JS — ${err.message}`));
  page.on('response', (res) => {
    const url = res.url();
    // Ожидаемый 404 у проверочного адреса не считаем
    if (res.status() >= 400 && !url.includes('/404-proverka/')) {
      problems.push(`${profile.name} ${current}: ${res.status()} ${url}`);
    }
  });

  for (const path of paths) {
    current = path;
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    // Прокручиваем до низа, чтобы сработали ленивые блоки и анимации появления
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    }));
    // Ссылки страницы: внутренние проверим отдельно, якоря на этой же странице — сразу
    if (profile === profiles[0]) {
      const found = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => ({
          href: a.href,
          missingAnchor: a.hash && a.pathname === location.pathname && !document.getElementById(decodeURIComponent(a.hash.slice(1))),
        })),
      );
      for (const l of found) {
        if (l.missingAnchor) problems.push(`${path}: нет якоря ${l.href}`);
        if (l.href.startsWith(base) && !l.href.includes('/404-proverka/')) links.add(l.href);
      }
    }
    if (info.overflow > 0) problems.push(`${profile.name} ${path}: горизонтальная прокрутка ${info.overflow} px`);
    if (info.h1 !== 1) problems.push(`${profile.name} ${path}: заголовков h1 — ${info.h1}`);
    if (!info.title || !info.description) problems.push(`${profile.name} ${path}: нет title или description`);
  }
  await context.close();
  console.log(`${profile.name}: проверено страниц — ${paths.length}`);
}

await browser.close();

// Внутренние ссылки: страница отвечает 200, якорь на ней есть
const checkPage = await (await chromium.launch()).newPage();
for (const href of links) {
  const url = new URL(href);
  const res = await checkPage.goto(`${url.origin}${url.pathname}`, { waitUntil: 'domcontentloaded' });
  if (!res || res.status() !== 200) {
    problems.push(`ссылка ${href}: ответ ${res?.status()}`);
    continue;
  }
  if (url.hash && !(await checkPage.$(`[id="${decodeURIComponent(url.hash.slice(1))}"]`))) {
    problems.push(`ссылка ${href}: на странице нет якоря`);
  }
}
await checkPage.context().browser()?.close();
console.log(`Внутренних ссылок проверено: ${links.size}`);

if (problems.length) {
  console.log(`\nНайдено проблем: ${problems.length}`);
  for (const p of problems) console.log(`- ${p}`);
  process.exit(1);
}
console.log('\nПроблем не найдено.');
