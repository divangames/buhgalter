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

## Как получить `YANDEX_TOKEN` (OAuth для Метрики)

Ниже пошагово, как получить токен формата `y0_AgAAAA...` для GitHub Secrets.

1. Авторизуйся в Яндексе под аккаунтом, у которого есть доступ к нужному счетчику Метрики.
2. Открой страницу регистрации приложения:
   - [https://oauth.yandex.ru/client/new](https://oauth.yandex.ru/client/new)
3. Заполни форму:
   - **Название**: например `Мой сайт — API Метрики`
   - **Платформы**: `Веб-сервисы`
   - **Callback URI**: нажми `Подставить URL для разработки` (должен стать `https://oauth.yandex.ru/verification_code`)
   - **Доступ к данным**:
     - `metrika:read` (обязательно для чтения статистики)
     - `metrika:write` (по необходимости)
     - `passport:business` (только если используешь org-логины)
4. Нажми `Создать приложение`.
5. Скопируй `Client ID` (Идентификатор приложения).
6. Открой ссылку авторизации (подставь свой `Client ID`):
   - `https://oauth.yandex.ru/authorize?response_type=token&client_id=<application_id>`
7. Нажми `Разрешить`.
8. После редиректа скопируй значение `access_token` из URL:
   - пример URL: `https://oauth.yandex.ru/verification_code#access_token=y0_AgAAAA...&token_type=bearer&expires_in=31536000`
   - бери только значение после `access_token=` и до `&`
9. Добавь токен в GitHub:
   - `Settings -> Secrets and variables -> Actions -> New repository secret`
   - имя: `YANDEX_TOKEN`
   - значение: токен **без** префикса `OAuth `

### Проверка токена (опционально)

```bash
curl -H "Authorization: OAuth y0_AgAAAA..." https://api-metrika.yandex.net/management/v1/counters
```

Если все хорошо, вернется JSON со списком счетчиков.

### Важные замечания

- Не публикуй `YANDEX_TOKEN` и `Client Secret` в открытых местах.
- Срок токена обычно до 1 года (`expires_in=31536000`), потом нужно получить новый.
- Токен можно отозвать в Яндекс-аккаунте в разделе приложений с доступом.
- Ошибки `401/403` обычно означают: неверный/просроченный токен, нет доступа к счетчику или не выданы нужные права.
- Токен Яндекса обычно начинается с `y0_`.
