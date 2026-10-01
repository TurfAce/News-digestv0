import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NewsDashboard } from "@/components/news-dashboard";
import { fetchNewsResult } from "@/utils/supabase/fetchNews";
import { demoNews } from "@/lib/demo";
export const dynamic = "force-dynamic";
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const demo = (await searchParams).demo === "1";
  const result = demo
    ? { items: demoNews, failedCategories: [], fetchedAt: null }
    : await fetchNewsResult();
  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/20 px-4 pb-20 pt-28">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-medium text-accent">
                READ · THINK · DISCUSS
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                ニュースから、自分の考えへ。
              </h1>
              <p className="mt-3 text-muted-foreground">
                業界を知る。根拠を確かめる。面接で話したい視点を見つける。
              </p>
            </div>
            <Link
              className="underline underline-offset-4"
              href={demo ? "/news" : "/news?demo=1"}
            >
              {demo ? "最新ニュースへ" : "サンプルで体験"}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            登録不要で利用できます。保存した記事はこのブラウザーに残ります。
          </p>
          {demo && (
            <div
              role="status"
              className="rounded-xl border border-accent/40 bg-accent/10 p-4"
            >
              デモモード：記事は架空のサンプル、分析は手作業の見本です。外部APIは呼び出しません。
            </div>
          )}
          {result.failedCategories.length > 0 && (
            <div role="status" className="rounded-xl border p-4">
              {result.items.length
                ? "一部の業界ニュースを取得できませんでした。"
                : "現在ニュースを取得できません。時間をおいて再読み込みしてください。"}
              <p className="mt-2 text-sm text-muted-foreground">
                対象：{result.failedCategories.join("、")}
              </p>
              <a href="/news" className="mt-2 inline-block underline">
                再読み込み
              </a>
            </div>
          )}
          {result.fetchedAt && (
            <p className="text-xs text-muted-foreground">
              取得時刻：
              {new Date(result.fetchedAt).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })}{" "}
              JST · 約10分ごとに更新
            </p>
          )}
          <NewsDashboard newsItems={result.items} userInterests={[]} />
        </div>
      </main>
      <Footer />
    </>
  );
}
