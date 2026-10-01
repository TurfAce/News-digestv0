import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchLatestNews } from "@/utils/supabase/fetchNews";
import { getInsight } from "@/lib/insight-service";
import { hasEnoughContext } from "@/lib/news-utils";
import { insufficientInsight } from "@/lib/gemini";
export const runtime = "nodejs";
const inputSchema = z
  .object({ articleId: z.string().regex(/^[a-f0-9]{64}$/) })
  .strict();
export async function POST(request: NextRequest) {
  const reply = (data: object, status = 200) =>
    NextResponse.json(data, {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "3600" } : {}),
      },
    });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next.js may normalize nextUrl to localhost even when the browser uses
      // 127.0.0.1. Compare with the actual request host instead.
      if (new URL(origin).host !== request.headers.get("host"))
        return reply({ error: "このサイトから操作してください。" }, 403);
    } catch {
      return reply({ error: "このサイトから操作してください。" }, 403);
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "JSON形式で送信してください。" }, 415);
  // Stream-limit even when Content-Length is absent.
  let raw = "";
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "記事IDが必要です。" }, 400);
  try {
    const decoder = new TextDecoder();
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 1024) {
        await reader.cancel();
        return reply({ error: "入力が大きすぎます。" }, 413);
      }
      raw += decoder.decode(chunk.value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return reply({ error: "入力を読み取れませんでした。" }, 400);
  }
  let input;
  try {
    input = inputSchema.parse(JSON.parse(raw));
  } catch {
    return reply({ error: "記事IDを確認してください。" }, 400);
  }
  const article = (await fetchLatestNews()).find(
    (item) => item.id === input.articleId,
  );
  if (!article)
    return reply(
      {
        error:
          "この記事は現在の取得対象にありません。元記事を読むか、ニュースを更新してください。",
      },
      404,
    );
  if (!hasEnoughContext(article.title, article.summary))
    return reply(insufficientInsight());
  try {
    return reply(await getInsight(article));
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "RATE_LIMIT")
      return reply(
        {
          error:
            "AI分析の利用上限に達しました。時間をおいてお試しください。ニュース閲覧は引き続き利用できます。",
        },
        429,
      );
    if (code === "AI_UNAVAILABLE")
      return reply(
        {
          error: "AI分析は現在準備中です。元記事の閲覧やデモをご利用ください。",
        },
        503,
      );
    return reply(
      {
        error:
          "信頼できる分析を取得できませんでした。時間をおいて再試行するか、元記事を確認してください。",
      },
      502,
    );
  }
}
