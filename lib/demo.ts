import type { NewsItem, Insight } from "./news-types";
export const demoNews: NewsItem[] = [
  {
    id: "demo-ai",
    title: "架空の小売企業が、店舗の需要予測AIを試験導入",
    category: "小売・流通",
    sourceName: "体験用の架空記事",
    publishedAt: "2026-09-01T00:00:00.000Z",
    url: "https://example.com/demo-ai",
    demo: true,
    summary:
      "架空企業ミライストアは、10店舗で需要予測AIの試験運用を始めた。過去の販売履歴と天候を使い、翌日の発注量の候補を提示する。最終的な発注量は店舗担当者が決める。試験期間は3か月で、食品廃棄量と欠品率、担当者の作業時間を比較する計画。現時点で削減効果は公表されていない。",
  },
  {
    id: "demo-tech",
    title: "架空のソフトウェア企業が新卒研修にAIコードレビューを導入",
    category: "IT・テクノロジー",
    sourceName: "体験用の架空記事",
    publishedAt: "2026-09-02T00:00:00.000Z",
    url: "https://example.com/demo-tech",
    demo: true,
    summary:
      "架空企業テックリーフは新卒研修で、AIによるコードレビューを試行する。AIの指摘は研修参加者と指導担当者が確認し、採用の理由を記録する。社内の機密コードは入力せず、研修専用のサンプルを利用する。研修後に理解度テストとレビュー時間を評価する予定で、学習効果の結果はまだ出ていない。",
  },
  {
    id: "demo-short",
    title: "架空の銀行が新サービスを発表",
    category: "金融・銀行",
    sourceName: "体験用の架空記事",
    publishedAt: null,
    url: "https://example.com/demo-short",
    demo: true,
    summary: "新サービスを発表。詳細は未掲載。",
  },
];
export function demoInsight(article: NewsItem): Insight {
  const retail = article.id === "demo-ai";
  return {
    summary: retail
      ? "10店舗で需要予測AIを試験導入。発注は担当者が最終判断し、3か月間の評価を予定しています。削減効果は未公表です。"
      : "新卒研修にAIレビューを試行し、人が指摘を確認する設計です。学習効果は未検証です。",
    opinionPositive: retail
      ? "発注判断の支援につながる可能性があります。実際の効果は評価を待つ必要があります。"
      : "指摘を検討する過程が学習につながる可能性があります。",
    opinionCritical:
      "導入した事実だけでは効果を判断できません。比較条件や測定結果の確認が必要です。",
    question: "導入効果を確かめるには、どの指標をどの条件で比較しますか？",
    evidence: [
      retail
        ? "最終的な発注量は店舗担当者が決める。"
        : "学習効果の結果はまだ出ていない。",
    ],
    insufficient: false,
    generatedAt: "2026-09-01T00:00:00.000Z",
    model: "手作業のサンプル（AI未実行）",
    basis: "架空記事の概要",
  };
}
