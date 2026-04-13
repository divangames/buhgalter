# Views Kit (LPMotor + Yandex Metrika)

Готовый набор для переноса на другие сайты.

## Что внутри

- `blog-views-loader.js` — скрипт для карточек блога (берет данные из `views.json`)
- `ArticleViewsWidget.html` — виджет для страницы статьи (дата + просмотры)
- `.github/workflows/update-views.yml` — GitHub Action для обновления `views.json`
- `scripts/update-views.js` — Node-скрипт, который забирает статистику из Метрики
- `articles.json` — список URL статей для обновления

## Быстрый запуск

1. Вставь `blog-views-loader.js` в блок блога (внутрь `<script> ... </script>`).
2. Вставь `ArticleViewsWidget.html` в шаблон страницы статьи.
3. В репозитории с `views.json` добавь:
   - `.github/workflows/update-views.yml`
   - `scripts/update-views.js`
   - `articles.json`
4. Добавь секреты GitHub Actions:
   - `YANDEX_TOKEN` (без префикса `OAuth `)
   - `YANDEX_COUNTER_ID` (число)
5. Запусти workflow `Update views.json from Yandex Metrika`.

## Важно

- Для новой статьи добавляй путь в `articles.json`.
- Путь должен совпадать с `href` карточки и URL страницы статьи.
- Если значения не грузятся, проверь доступность `views.json` и CORS.

## Как добавить новую статью

1. Добавь карточку статьи в блок блога (`Blog.html`) с корректным `href`, например:
   - `/новая-статья-про-налоги`
2. Создай страницу самой статьи в LPMotor с этим же URL.
3. Вставь в страницу статьи код из `ArticleViewsWidget.html` и вручную обнови дату в:
   - `<span class="lpm-article-date">...</span>`
4. Добавь путь новой статьи в `articles.json`.
5. Запусти GitHub Action `Update views.json from Yandex Metrika` (или дождись запуска по расписанию).
6. Проверь, что в `views.json` появился ключ новой статьи.
7. Обнови страницу блога и страницу статьи (`Ctrl+F5`) и проверь, что показывается число просмотров.

### Чеклист совпадения путей

- `href` в карточке блога = путь в `articles.json` = `window.location.pathname` статьи
- пример корректного совпадения: `/новая-статья-про-налоги`
- не добавляй домен в `articles.json`, только путь
