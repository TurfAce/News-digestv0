"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsCard } from "@/components/news-card";
import { newsSchema, type NewsItem } from "@/lib/news-types";
import { INTEREST_GENRES } from "@/lib/constants";
const KEY = "news-digest:saved-articles:v2";
export function NewsDashboard({
  newsItems,
  userInterests,
}: {
  newsItems: NewsItem[];
  userInterests: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [saved, setSaved] = useState<NewsItem[]>([]);
  const [ready, setReady] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [interests, setInterests] = useState<string[]>(userInterests);
  const [onlyInterests, setOnlyInterests] = useState(false);
  // Hydrate browser-only preferences after SSR; do not write until user interaction.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const result = newsSchema.array().max(200).safeParse(JSON.parse(raw));
        if (result.success) setSaved(result.data);
        else
          setNotice(
            "保存データを読み込めませんでした。必要な記事を保存し直してください。",
          );
      }
      const prefs = JSON.parse(
        localStorage.getItem("news-digest:interests") || "null",
      );
      if (Array.isArray(prefs))
        setInterests(
          prefs.filter(
            (v) =>
              typeof v === "string" &&
              INTEREST_GENRES.includes(v as (typeof INTEREST_GENRES)[number]),
          ),
        );
      else if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        fetch("/api/interests", { signal: AbortSignal.timeout(5000) })
          .then((r) => r.json())
          .then((data) => {
            if (
              !localStorage.getItem("news-digest:interests") &&
              Array.isArray(data.interests)
            ) {
              setInterests(
                data.interests.filter((v: string) =>
                  INTEREST_GENRES.includes(
                    v as (typeof INTEREST_GENRES)[number],
                  ),
                ),
              );
              setOnlyInterests(data.interests.length > 0);
            }
          })
          .catch(() => {});
      }
    } catch {
      setNotice(
        "ブラウザーの保存機能を利用できないか、保存データが壊れています。この画面では引き続き利用できます。",
      );
    }
    setReady(true);
  }, [newsItems]);
  /* eslint-enable react-hooks/set-state-in-effect */
  function toggleSaved(id: string) {
    const item =
      newsItems.find((n) => n.id === id) || saved.find((n) => n.id === id);
    if (!item) return;
    if (!saved.some((n) => n.id === id) && saved.length >= 200) {
      setNotice("保存上限は200件です。不要な記事の保存を解除してください。");
      return;
    }
    const next = saved.some((n) => n.id === id)
      ? saved.filter((n) => n.id !== id)
      : [...saved, item];
    setSaved(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setNotice("");
    } catch {
      setNotice("保存できませんでした。この画面を閉じると変更が失われます。");
    }
  }
  function toggleInterest(genre: string) {
    const next = interests.includes(genre)
      ? interests.filter((v) => v !== genre)
      : [...interests, genre];
    setInterests(next);
    try {
      localStorage.setItem("news-digest:interests", JSON.stringify(next));
    } catch {
      setNotice("業界設定を保存できませんでした。");
    }
  }
  const items = useMemo(
    () =>
      (onlySaved ? saved : newsItems).filter(
        (n) =>
          (category === "すべて" || n.category === category) &&
          (!onlyInterests || interests.includes(n.category)) &&
          `${n.title} ${n.summary} ${n.sourceName}`
            .normalize("NFKC")
            .toLowerCase()
            .includes(query.trim().normalize("NFKC").toLowerCase()),
      ),
    [newsItems, saved, onlySaved, category, onlyInterests, interests, query],
  );
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="news-search" className="sr-only">
            記事・企業・キーワードを検索
          </label>
          <Input
            id="news-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事・企業・キーワードを検索"
            className="h-11 flex-1 min-w-48"
          />
          <Button
            disabled={!ready}
            variant={onlySaved ? "default" : "outline"}
            aria-pressed={onlySaved}
            onClick={() => setOnlySaved(!onlySaved)}
          >
            あとで読む（{saved.length}）
          </Button>
        </div>
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="業界で絞り込み"
        >
          {["すべて", ...INTEREST_GENRES].map((g) => (
            <Button
              key={g}
              size="sm"
              variant={category === g ? "default" : "ghost"}
              aria-pressed={category === g}
              onClick={() => setCategory(g)}
            >
              {g}
            </Button>
          ))}
        </div>
        <details className="mt-4 border-t pt-4">
          <summary className="cursor-pointer text-sm">
            興味のある業界を設定（このブラウザーに保存）
          </summary>
          <div className="mt-3 flex flex-wrap gap-3">
            {INTEREST_GENRES.map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={interests.includes(g)}
                  onChange={() => toggleInterest(g)}
                />
                {g}
              </label>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyInterests}
              onChange={(e) => setOnlyInterests(e.target.checked)}
            />
            選んだ業界だけ表示する
          </label>
          <p className="mt-3 text-xs text-muted-foreground">
            アカウントの業界設定は
            <Link href="/mypage" className="underline">
              マイページ
            </Link>
            から管理できます。
          </p>
        </details>
      </div>
      {notice && (
        <p role="status" className="rounded-lg border p-3 text-sm">
          {notice}
        </p>
      )}
      <div className="flex items-center justify-between">
        <p role="status" className="text-sm text-muted-foreground">
          {items.length}件{onlySaved ? "の保存記事" : "の記事"} · 新着順
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setQuery("");
            setCategory("すべて");
            setOnlySaved(false);
            setOnlyInterests(false);
          }}
        >
          条件をリセット
        </Button>
      </div>
      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...items]
            .sort(
              (a, b) =>
                (Date.parse(b.publishedAt || "") || 0) -
                (Date.parse(a.publishedAt || "") || 0),
            )
            .map((n) => (
              <NewsCard
                key={n.id}
                news={n}
                isSaved={saved.some((s) => s.id === n.id)}
                onToggleSaved={ready ? toggleSaved : undefined}
              />
            ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h2 className="font-bold">
            {onlySaved
              ? "条件に合う保存記事はありません"
              : "表示できる記事がありません"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {onlySaved
              ? "記事のしおりボタンから保存できます。検索条件もご確認ください。"
              : "検索条件を変えるか、サンプルで使い方を体験してください。"}
          </p>
          <Link href="/news?demo=1" className="mt-4 inline-block underline">
            デモを試す
          </Link>
        </div>
      )}
    </div>
  );
}
