"use client";
import { useState } from "react";
import { Bookmark, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsInsights } from "@/components/news-insights";
import type { NewsItem } from "@/lib/news-types";
import { analysisTier } from "@/lib/news-utils";
export type { NewsItem } from "@/lib/news-types";
export function NewsCard({
  news,
  isSaved,
  onToggleSaved,
}: {
  news: NewsItem;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
  priority?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {news.category}
          </span>
          {!news.demo &&
            analysisTier(news.title, news.summary) === "headline" && (
              <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                見出しのみ
              </span>
            )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label={isSaved ? "保存を解除" : "あとで読むに保存"}
          aria-pressed={!!isSaved}
          disabled={!onToggleSaved}
          onClick={() => onToggleSaved?.(news.id)}
        >
          <Bookmark className={isSaved ? "fill-current" : ""} />
        </Button>
      </div>
      <h2 className="text-lg font-bold leading-relaxed">{news.title}</h2>
      <p className="mt-3 text-xs text-muted-foreground">
        {news.sourceName} ·{" "}
        {news.publishedAt ? (
          <time dateTime={news.publishedAt}>
            {new Date(news.publishedAt).toLocaleDateString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </time>
        ) : (
          "公開日不明"
        )}
      </p>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
        {news.summary || "概要は配信されていません。元記事をご確認ください。"}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {!news.demo && (
          <Button asChild variant="outline" size="sm">
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              元記事を読む
              <ExternalLink />
            </a>
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          aria-expanded={expanded}
          aria-controls={`insight-${news.id}`}
          onClick={() => setExpanded(!expanded)}
        >
          要約・考えるヒント
          <ChevronDown className={expanded ? "rotate-180" : ""} />
        </Button>
      </div>
      <div
        id={`insight-${news.id}`}
        hidden={!expanded}
        className="mt-5 border-t pt-5"
      >
        <NewsInsights article={news} />
      </div>
    </article>
  );
}
