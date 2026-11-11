// Список всего, что нужно получить от Армана или партнёров до запуска:
// пометки [TODO: …] в текстах и данных, а также поля priceTodo (продукты)
// и todo (прайс). Запуск: npm run todo
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const folders = ['src', 'functions', 'public'];
const extensions = new Set(['.astro', '.ts', '.mjs', '.js', '.md', '.mdx', '.yaml', '.yml', '.json', '.html', '.txt']);

// [TODO: …] в тексте. Описания синтаксиса и шаблоны в коде — не задачи
const inline = /\[TODO:[^\]]*\]/g;
const notTask = (text) => text === '[TODO: …]' || text.includes('${') || text.includes('([^');
// Поля-пометки в данных: priceTodo: "…" у продуктов, todo: … в прайсе
const field = /^\s*(priceTodo|todo):\s*["']?(.+?)["']?\s*$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (extensions.has(extname(name))) yield path;
  }
}

const found = [];
for (const folder of folders) {
  let files;
  try {
    files = [...walk(join(root, folder))];
  } catch {
    continue; // папки может не быть
  }
  for (const file of files) {
    const rel = relative(root, file).replaceAll('\\', '/');
    const data = /\.(md|mdx|ya?ml)$/.test(file);
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((line, index) => {
        for (const match of line.matchAll(inline)) {
          if (!notTask(match[0])) found.push(`${rel}:${index + 1}  ${match[0]}`);
        }
        const meta = data && line.match(field);
        if (meta && !line.trimStart().startsWith('#')) found.push(`${rel}:${index + 1}  [TODO: ${meta[2]}]`);
      });
  }
}

console.log(found.length ? `${found.join('\n')}\n\nВсего TODO: ${found.length}` : 'TODO не найдено');
