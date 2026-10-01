import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { createHash } from "node:crypto";
import { INTEREST_GENRES } from "@/lib/constants";
import type { NewsItem } from "@/lib/news-types";
import { canonicalUrl, cleanText, validDate } from "@/lib/news-utils";
const parser = new Parser({
  timeout: 8000,
  customFields: { item: ["source"] },
});
const queries = [
  "IT テクノロジー",
  "ビジネス 経済",
  "金融 銀行",
  "メーカー 製造業",
  "コンサルティング",
  "広告 マーケティング",
  "小売 流通",
  "政治 社会",
  "キャリア 働き方",
  "国内 ニュース",
  "国際 情勢",
];
export interface NewsResult {
  items: NewsItem[];
  failedCategories: string[];
  fetchedAt: string;
}
async function loadNews(): Promise<NewsResult> {
  const feeds = [
    ...INTEREST_GENRES.map((category, i) => ({
      category,
      source: "Google News経由",
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(queries[i] + " when:3d")}&hl=ja&gl=JP&ceid=JP:ja`,
    })),
    {
      category: "IT・テクノロジー",
      source: "Qiita（技術記事）",
      url: "https://qiita.com/popular-items/feed",
    },
    {
      category: "IT・テクノロジー",
      source: "ITmedia NEWS",
      url: "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml",
    },
    {
      category: "国内ニュース",
      source: "NHK NEWS",
      url: "https://news.web.nhk/n-data/conf/na/rss/cat0.xml",
    },
    {
      category: "ビジネス・経済",
      source: "NHK NEWS",
      url: "https://news.web.nhk/n-data/conf/na/rss/cat5.xml",
    },
    {
      category: "政治・社会",
      source: "NHK NEWS",
      url: "https://news.web.nhk/n-data/conf/na/rss/cat4.xml",
    },
    {
      category: "国際情勢",
      source: "NHK NEWS",
      url: "https://news.web.nhk/n-data/conf/na/rss/cat6.xml",
    },
  ];
  const results = await Promise.allSettled(
    feeds.map(async ({ category, source: fallbackSource, url: feedUrl }) => {
      const feed = await parser.parseURL(feedUrl);
      return feed.items.slice(0, 8).flatMap((item) => {
        const url = canonicalUrl(item.link);
        const title = cleanText(item.title).slice(0, 1000);
        if (!url || !title) return [];
        const source = item.source as unknown;
        const sourceName =
          typeof source === "string"
            ? source
            : source && typeof source === "object" && "_" in source
              ? String(source._)
              : fallbackSource;
        return [
          {
            id: createHash("sha256").update(url).digest("hex"),
            title,
            summary: cleanText(item.contentSnippet || item.content).slice(
              0,
              20000,
            ),
            publishedAt: validDate(item.isoDate || item.pubDate),
            category,
            sourceName: cleanText(sourceName).slice(0, 200),
            url,
          },
        ];
      });
    }),
  );
  const items = new Map<string, NewsItem>();
  const failedCategories: string[] = [];
  results.forEach((r, i) => {
    if (r.status === "rejected") failedCategories.push(feeds[i].category);
    else
      r.value.forEach((item) => {
        if (!items.has(item.url)) items.set(item.url, item);
      });
  });
  if (failedCategories.length === feeds.length)
    throw new Error("All feeds unavailable");
  return {
    items: [...items.values()].sort(
      (a, b) =>
        (Date.parse(b.publishedAt ?? "") || 0) -
        (Date.parse(a.publishedAt ?? "") || 0),
    ),
    failedCategories: [...new Set(failedCategories)],
    fetchedAt: new Date().toISOString(),
  };
}
const cachedNews = unstable_cache(loadNews, ["news-feeds-v3"], {
  revalidate: 600,
});
export async function fetchNewsResult(): Promise<NewsResult> {
  try {
    return await cachedNews();
  } catch {
    return {
      items: [],
      failedCategories: [...INTEREST_GENRES],
      fetchedAt: new Date().toISOString(),
    };
  }
}
export async function fetchLatestNews() {
  return (await fetchNewsResult()).items;
}
