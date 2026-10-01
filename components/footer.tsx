import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6">
        <div>
          <p className="font-bold">News Digest</p>
          <p className="mt-2 text-xs text-muted-foreground">
            ニュースを理解し、自分の視点を見つける。
          </p>
        </div>
        <nav className="flex gap-5 text-sm">
          <Link href="/news">ニュース</Link>
          <Link href="/news?demo=1">デモ</Link>
          <Link href="/about">使い方・データについて</Link>
        </nav>
      </div>
    </footer>
  );
}
