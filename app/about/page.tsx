import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export default function About() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-20 pt-28">
        <h1 className="text-3xl font-bold">使い方・データについて</h1>
        <h2 className="text-xl font-bold">アカウントなしで使えます</h2>
        <p>
          ニュースの閲覧・検索・保存・AI分析は登録不要です。保存記事と興味のある業界は、このブラウザーの保存領域に記録されます。ブラウザーのデータ削除で消え、他の端末には同期されません。アカウント機能を設定した環境では、業界設定をマイページでも管理できます。
        </p>
        <h2 className="text-xl font-bold">AIが分析する情報</h2>
        <p>
          Google Google
          News、NHK、ITmedia、QiitaのRSSから得た見出しと概要をGeminiに送信します。記事全文は取得していません。説明文がある記事は要約し、見出しだけの記事は見出しから分かる範囲を整理します。内容を特定できない記事は分析しません。生成された考察は確認済みの事実ではありません。必ず元記事も確認してください。
        </p>
        <h2 className="text-xl font-bold">デモと利用上限</h2>
        <p>
          デモの記事は架空で、分析も手作業の見本です。実際のニュースやAIの評価結果ではありません。通常のAI分析には利用上限があり、上限や外部サービスの障害により一時的に利用できない場合があります。
        </p>
        <h2 className="text-xl font-bold">保存とサービス</h2>
        <p>
          ニュース取得結果とAI分析は再利用のためサーバーで一時保存します。ログインを利用する場合はSupabaseで認証し、メールアドレスと興味のある業界を保存します。本アプリは学習・開発プロジェクトです。ニュースの権利は各配信元に帰属します。
        </p>
      </main>
      <Footer />
    </>
  );
}
