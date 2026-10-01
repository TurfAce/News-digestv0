"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { insightSchema, type Insight, type NewsItem } from "@/lib/news-types";
import { demoInsight } from "@/lib/demo";
import { analysisTier } from "@/lib/news-utils";
export function NewsInsights({ article }: { article: NewsItem }) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function generate() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      if (article.demo) {
        setInsight(demoInsight(article));
        return;
      }
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id }),
        signal: AbortSignal.timeout(40000),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.error || "分析できませんでした。再試行してください。",
        );
      const { generatedAt, model, basis, ...content } = body;
      setInsight({
        ...insightSchema.parse(content),
        generatedAt,
        model,
        basis,
      });
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "TimeoutError"
          ? e.message
          : "処理が時間内に完了しませんでした。再試行してください。",
      );
    } finally {
      setLoading(false);
    }
  }
  const tier = analysisTier(article.title, article.summary);
  const sufficient = tier !== "insufficient";
  return (
    <div className="space-y-4 text-sm leading-7">
      <p className="text-xs text-muted-foreground">
        分析対象：
        {article.demo
          ? "架空記事の概要"
          : tier === "headline"
            ? "見出しのみ。記事本文や詳細は確認できていません。"
            : "RSSのタイトルと概要。記事本文は取得していません。"}
      </p>
      <details>
        <summary className="cursor-pointer underline underline-offset-4">
          分析の元になった概要を見る
        </summary>
        <p className="mt-2 rounded-lg bg-muted p-3">
          {article.summary || "概要なし"}
        </p>
      </details>
      {!sufficient ? (
        <p role="status" className="rounded-lg bg-muted p-3">
          見出しと概要から内容を特定できません。元記事で事実や数字を確認してください。
        </p>
      ) : (
        !insight && (
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading
              ? "分析しています…"
              : article.demo
                ? "サンプル分析を見る"
                : tier === "headline"
                  ? "見出しから分かることを整理する"
                  : "AIで要約・分析する"}
          </Button>
        )
      )}
      <p role="status" className="sr-only">
        {loading ? "分析中" : insight ? "分析が完了しました" : ""}
      </p>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {insight && (
        <>
          <section>
            <h3 className="font-bold">
              {insight.insufficient
                ? "情報不足"
                : insight.basis.startsWith("見出し")
                  ? "見出しの要点"
                  : "事実の要約"}
            </h3>
            <p>{insight.summary}</p>
          </section>
          {insight.evidence.length > 0 && (
            <section>
              <h3 className="font-bold">
                {insight.basis.startsWith("見出し")
                  ? "元の見出し"
                  : "概要内の根拠"}
              </h3>
              {insight.evidence.map((e) => (
                <blockquote
                  key={e}
                  className="mt-2 border-l-2 border-accent pl-3"
                >
                  {e}
                </blockquote>
              ))}
            </section>
          )}
          {insight.opinionPositive && (
            <section>
              <h3 className="font-bold">可能性・期待（AIの考察）</h3>
              <p>{insight.opinionPositive}</p>
            </section>
          )}
          {insight.opinionCritical && (
            <section>
              <h3 className="font-bold">確認したい点（AIの考察）</h3>
              <p>{insight.opinionCritical}</p>
            </section>
          )}
          <section className="rounded-xl bg-accent/10 p-4">
            <h3 className="font-bold">あなたなら、どう考える？</h3>
            <p>{insight.question}</p>
          </section>
          <p className="text-xs text-muted-foreground">
            {insight.basis} · {insight.model} ·{" "}
            {new Date(insight.generatedAt).toLocaleString("ja-JP")}
            <br />
            AIの出力には誤りが含まれる場合があります。元記事と照らし合わせてご利用ください。
          </p>
        </>
      )}
    </div>
  );
}
