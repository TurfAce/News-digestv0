"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 pt-28">
      <h1 className="text-2xl font-bold">ニュースを表示できませんでした</h1>
      <p>時間をおいて再試行してください。</p>
      <Button onClick={reset}>再試行</Button>
      <a href="/news?demo=1" className="ml-4 underline">
        デモを試す
      </a>
    </main>
  );
}
