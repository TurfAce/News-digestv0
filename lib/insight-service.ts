import type { NewsItem } from "./news-types";
import { generateNewsInsights } from "./gemini";
import { createAnalysisCache } from "./analysis-cache";
const cached = createAnalysisCache(async (key) => {
  const { article } = JSON.parse(key) as { article: NewsItem };
  return generateNewsInsights(article);
});
export function getInsight(article: NewsItem) {
  return cached(
    JSON.stringify({
      version: "v3",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      article,
    }),
  );
}
