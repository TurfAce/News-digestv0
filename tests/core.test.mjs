import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url);
const { canonicalUrl, cleanText, validDate, hasEnoughContext, analysisTier } =
  await jiti.import("../lib/news-utils.ts");
const { insightSchema, newsSchema, validateInsight } = await jiti.import(
  "../lib/news-types.ts",
);
const { createAnalysisCache } = await jiti.import("../lib/analysis-cache.ts");
const { demoNews, demoInsight } = await jiti.import("../lib/demo.ts");
test("missing descriptions never become undefined text", () => {
  assert.equal(cleanText(undefined), "");
  assert.equal(cleanText("<p>A &amp; B</p>"), "A & B");
});
test("only HTTP URLs, tracking removal, stable dedup key", () => {
  assert.equal(canonicalUrl("javascript:alert(1)"), null);
  assert.equal(
    canonicalUrl("https://example.com/a?utm_source=x&id=2#top"),
    "https://example.com/a?id=2",
  );
  assert.equal(canonicalUrl(undefined), null);
});
test("bad dates remain unknown, not today", () => {
  assert.equal(validDate("not-a-date"), null);
  assert.equal(validDate(undefined), null);
  assert.equal(validDate("2026-01-01"), "2026-01-01T00:00:00.000Z");
});
test("very short titles without useful descriptions do not trigger AI", () => {
  assert.equal(hasEnoughContext("見出し", "見出し"), false);
  assert.equal(hasEnoughContext("見出し", "詳細未掲載"), false);
  assert.equal(hasEnoughContext(demoNews[0].title, demoNews[0].summary), true);
});
test("headline-only news is distinguishable from a described article", () => {
  const title = "日銀短観 大企業製造業の景気判断 6期連続で改善";
  assert.equal(analysisTier(title, `${title} - NHK NEWS`), "headline");
  assert.equal(
    analysisTier(
      title,
      "日銀が発表した指数はプラス24ポイントで、前回調査を2ポイント上回った。",
    ),
    "description",
  );
  assert.equal(
    analysisTier("新サービスを発表", "詳細は未掲載"),
    "insufficient",
  );
});
test("demo and persisted articles satisfy bounded schema", () => {
  demoNews.forEach((a) => newsSchema.parse(a));
  assert.equal(newsSchema.array().safeParse([{}]).success, false);
});
test("malformed AI output is rejected", () => {
  const content = { ...demoInsight(demoNews[0]) };
  delete content.model;
  delete content.basis;
  delete content.generatedAt;
  insightSchema.parse(content);
  assert.equal(
    insightSchema.safeParse({ ...content, summary: "" }).success,
    false,
  );
  assert.equal(
    insightSchema.safeParse({ ...content, evidence: "wrong" }).success,
    false,
  );
});
test("coalesces concurrent generation and reuses cached result", async () => {
  let calls = 0;
  const run = createAnalysisCache(async (k) => {
    calls++;
    return k;
  });
  assert.deepEqual(await Promise.all([run("a"), run("a")]), ["a", "a"]);
  await run("a");
  assert.equal(calls, 1);
});
test("failed generation is retryable, not cached", async () => {
  let calls = 0;
  const run = createAnalysisCache(async () => {
    if (++calls === 1) throw Error("failed");
    return "ok";
  });
  await assert.rejects(run("a"));
  assert.equal(await run("a"), "ok");
});
test("budget limits new calls but cache stays usable; window resets", async () => {
  let time = 0;
  const run = createAnalysisCache(
    async (k) => k,
    () => time,
    1,
  );
  await run("a");
  await assert.rejects(run("b"), /RATE_LIMIT/);
  assert.equal(await run("a"), "a");
  time = 3600000;
  assert.equal(await run("b"), "b");
});
test("expired cache regenerates", async () => {
  let time = 0,
    calls = 0;
  const run = createAnalysisCache(
    async () => ++calls,
    () => time,
  );
  assert.equal(await run("a"), 1);
  time = 86400001;
  assert.equal(await run("a"), 2);
});

test("invented evidence is rejected", () => {
  const content = { ...demoInsight(demoNews[0]) };
  delete content.model;
  delete content.basis;
  delete content.generatedAt;
  assert.throws(
    () =>
      validateInsight(
        { ...content, evidence: ["利益が50%増加した"] },
        demoNews[0].summary,
      ),
    /INVALID_EVIDENCE/,
  );
  validateInsight(content, demoNews[0].summary);
  validateInsight(
    { ...content, evidence: [demoNews[0].title] },
    `${demoNews[0].title}\n${demoNews[0].summary}`,
  );
});
test("concurrency cap rejects fourth distinct generation", async () => {
  let release;
  const gate = new Promise((r) => {
    release = r;
  });
  const run = createAnalysisCache(async (k) => {
    await gate;
    return k;
  });
  const jobs = [run("a"), run("b"), run("c")];
  await assert.rejects(run("d"), /RATE_LIMIT/);
  release();
  await Promise.all(jobs);
});
