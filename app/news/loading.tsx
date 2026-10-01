export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-28" role="status">
      <p>ニュースを読み込んでいます…</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
