# Аудит проекта mini-figma (аудит 2)

Дата: 2026-09-28. Ветка: `refactor/audit-fixes` (5 коммитов вперёд от `main`, 0 позади; `main` и `origin/main` синхронны, `main` не изменён).

## Что за проект

Мини-редактор фигур («mini-figma»): React 19 + TypeScript + Vite + Tailwind 4.
Возможности: сетка, пан/зум, рисование rect/ellipse, перетаскивание, заливка,
слои, undo/redo, деплой на GitHub Pages (`.github/workflows/deploy.yml`).
Отдельная обучающая страница `my-page/index.html` — вне сборки.

## Состояние git на момент аудита

| Что | Статус |
|---|---|
| Текущая ветка | `refactor/audit-fixes` |
| Относительно `main` | 5 вперёд / 0 позади |
| `origin/main` | синхронизирован с `main` (0/0) |
| Незакоммиченное | untracked: `AGENTS.md`, `opencode.json` |
| Stash | пусто |
| Ветки `refactor/*` | одна — текущая |

## Метод проверки

- `npx tsc --noEmit -p tsconfig.app.json` и `-p tsconfig.node.json` — 0 ошибок.
- `npm run lint` (oxlint) — 0 warnings / 0 errors (14 файлов, 116 правил).
- `git grep` по рабочей копии на секреты (токены, ключи, пароли) — чисто;
  единственное совпадение `id-token: write` в `deploy.yml` — стандартное
  разрешение GitHub Pages, не секрет.
- Построчный разбор `src/**`, конфигов и workflow.

## Найденные проблемы

| # | Проблема | Файл:строка | Серьёзность | Что делать |
|---|----------|-------------|-------------|------------|
| 1 | Проектные правила `AGENTS.md` и конфиг `opencode.json` не закоммичены (untracked) — при клоне репо правила теряются | AGENTS.md, opencode.json | P1 | Закоммитить оба файла (или добавить `opencode.json` в .gitignore, если он считается локальным) |
| 2 | Отсутствует `"strict": true` (и `noUncheckedSideEffectImports`) — ослаблен тайпчек: не ловятся null/undefined-ошибки, которые шаблон Vite ловит по умолчанию | tsconfig.app.json:2-24 | P1 | Включить `strict: true`, прогнать `tsc`, починить всплывшие ошибки |
| 3 | `onMouseLeave` обрывает активные операции (пан, рисование, перетаскивание), если курсор уходит с канваса — например, на тулбар/панели | src/components/Canvas.tsx:136 | P2 | Слушать `mouseup`/`pointerup` на `window`, а не на контейнере |
| 4 | `stopPropagation()` выполняется до проверки `isSpacePressed` — нажатие на фигуру в режиме пана не начинает пан | src/components/Canvas.tsx:81-82 | P2 | Проверять `isSpacePressed`/tool до `stopPropagation` |
| 5 | `zoomAt` использует сырые `clientX/clientY` без вычета rect контейнера — работает только пока контейнер в (0,0); при смене раскладки зум якорится мимо курсора | src/components/Canvas.tsx:56-59 | P2 | Приводить координаты к контейнеру (как в `toCanvasPoint`) |
| 6 | A11y: вложенный интерактив — `<button>` внутри `div[role=button]`; у color-input нет aria-label | src/components/LayersPanel.tsx:36-68 | P2 | Вынести кнопку удаления из role=button, добавить aria-label инпуту |
| 7 | `npm install` вместо `npm ci` в стартовом скрипте — установка может не совпасть с package-lock | start.command:5 | P2 | Заменить на `npm ci` (с фолбэком на install) |
| 8 | README — нетронутый шаблон Vite, не описывает реальный проект | README.md | P2 | Переписать: что за проект, как запустить, как деплоится |
| 9 | Ручки ресайза у фигур декоративные (`pointer-events-none`), ресайза нет | src/components/Shape.tsx:44-53 | P2 | Заготовка функции: либо реализовать ресайз, либо убрать до поры |
| 10 | `my-page/` — отдельная страница вне сборки (обучающая, осознанно) | my-page/index.html | P2 | Оставить как есть |

## Итоги

- P0 (секреты, критические баги): **не найдено**.
- P1: 2 — оба исправлены в этой же ветке отдельными коммитами:
  - AGENTS.md и opencode.json закоммичены;
  - `strict: true` + `noUncheckedSideEffectImports` включены в tsconfig.app.json
    (tsc обоих конфигов — 0 ошибок без правок кода).
- P2: 8 (рекомендации, не исправлялись по заданию).

## Справка: что уже исправлено (аудит 1, эта же ветка)

Каскадный рендер в `useViewport` (ленивая инициализация), мёртвый код
`addShape` и `canvasToScreen`, неиспользуемый `public/icons.svg`,
залежавшийся локальный `dist/` — всё исправлено отдельными коммитами
в `refactor/audit-fixes`.

## Definition of Done (аудит 2 + фикс P1)

- AUDIT.md создан (перезаписан свежим аудитом) и после фиксов обновлён — да.
- P0 пусто, P1 2/2 исправлено — да.
- Секретов в коде нет — да.
- Проверки после каждой правки: `tsc --noEmit` (оба конфига) 0 ошибок,
  `npm run lint` 0/0, после фикс-а tsconfig дополнительно `npm run build` — успех.
- Правки — в ветке `refactor/audit-fixes`; `main` не изменён.
