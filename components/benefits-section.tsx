export function BenefitsSection() {
  return (
    <section className="bg-card px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">理解を支える、3つの工夫。</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[
            [
              "探しやすく、残しやすく",
              "業界フィルターとキーワード検索で整理。保存した記事は、このブラウザーで読み返せます。",
            ],
            [
              "根拠が見えるAI分析",
              "分析対象の概要と根拠の引用を表示。事実の要約とAIの考察を分けて確認できます。",
            ],
            [
              "アカウントなしですぐ体験",
              "ニュース閲覧とAI分析は登録不要。架空記事のデモはAPIキーがなくても試せます。",
            ],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
