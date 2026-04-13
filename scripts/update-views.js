const fs = require("fs");

const TOKEN = process.env.YANDEX_TOKEN;
const COUNTER_ID = process.env.YANDEX_COUNTER_ID;
const SITE_HOST = "https://твоя-бухгалтерия.рф";

if (!TOKEN || !COUNTER_ID) {
  throw new Error("YANDEX_TOKEN or YANDEX_COUNTER_ID is missing");
}

const { articles } = JSON.parse(fs.readFileSync("articles.json", "utf8"));

async function fetchVisitsForPath(path) {
  // Визиты за последние 30 дней; можно изменить период.
  const params = new URLSearchParams({
    ids: COUNTER_ID,
    metrics: "ym:s:visits",
    dimensions: "ym:s:URLPath",
    filters: `ym:s:URLPath=='${path}'`,
    date1: "30daysAgo",
    date2: "today",
    accuracy: "full"
  });

  const url = `https://api-metrika.yandex.net/stat/v1/data?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `OAuth ${TOKEN}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Metrika API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const value = data?.data?.[0]?.metrics?.[0] ?? 0;
  return Math.round(Number(value) || 0);
}

(async () => {
  const views = {};

  for (const path of articles) {
    try {
      views[path] = await fetchVisitsForPath(path);
      console.log(`OK ${path}: ${views[path]}`);
    } catch (e) {
      console.error(`FAIL ${path}:`, e.message);
      views[path] = 0;
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    views
  };

  fs.writeFileSync("views.json", JSON.stringify(output, null, 2) + "\n", "utf8");
})();
