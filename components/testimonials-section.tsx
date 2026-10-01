export function TestimonialsSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-accent">使い方の例</p>
        <h2 className="mt-3 text-3xl font-bold">
          企業研究から、面接前の振り返りまで。
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [
              "企業研究",
              "企業名で検索し、業界の変化と企業の動きを結びつける。",
            ],
            [
              "意見の整理",
              "期待と懸念の両方を読み、自分が確認したい点を考える。",
            ],
            [
              "面接前の復習",
              "保存した記事から元の情報を読み直し、自分の言葉で説明する。",
            ],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold">{t}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
