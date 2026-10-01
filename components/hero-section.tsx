import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function HeroSection() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="mb-6 text-sm font-semibold tracking-widest text-accent">
            NEWS DIGEST / FOR INTERVIEW
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            ニュースを読む。
            <br />
            <span className="text-accent">自分の視点</span>が<br />
            見つかる。
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            志望業界のニュースから、事実と考察を整理。根拠を確かめながら、面接で話したい自分の考えを育てましょう。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/news">
                登録せずにニュースを見る
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/news?demo=1">デモを試す</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            閲覧・検索・保存・AI分析にアカウントは不要です。
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-7 shadow-sm md:p-10">
          <p className="text-xs font-semibold tracking-widest text-accent">
            HOW IT WORKS
          </p>
          <ol className="mt-6 space-y-8">
            {[
              [
                "01",
                "業界を選んで読む",
                "気になる記事を探して、あとで読むに保存。",
              ],
              [
                "02",
                "事実と考察を分ける",
                "RSS概要に基づく要約と、AIの考察を確認。",
              ],
              [
                "03",
                "自分ならどう考える？",
                "元記事に戻り、問いをきっかけに意見を深める。",
              ],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4">
                <span className="text-xl font-light text-accent">{n}</span>
                <div>
                  <h2 className="font-bold">{t}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t pt-5 text-xs leading-6 text-muted-foreground">
            AIはRSSのタイトルと概要を分析します。情報が足りない場合は推測せず、元記事の確認を案内します。
          </p>
        </div>
      </div>
    </section>
  );
}
