import Parser from 'rss-parser';
import { NewsItem } from "@/components/news-card"; // 型定義をインポート
import { prisma } from '@/lib/prisma';

const parser = new Parser();

// カテゴリごとの画像マッピング（MOCK_NEWSの画像を使用）
const CATEGORY_IMAGES: Record<string, string> = {
    'IT・テクノロジー': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'コンサルティング': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    'メーカー': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    '広告・マーケティング': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    '小売・流通': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    'その他': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
};

export async function fetchLatestNews(): Promise<NewsItem[]> {
    const feeds = [
        { url: encodeURI('https://qiita.com/popular-items/feed'), category: 'IT・テクノロジー', source: 'Qiita' },
        { url: encodeURI('https://news.google.com/rss/search?q=金融+銀行+when:3d&hl=ja&gl=JP&ceid=JP:ja'), category: '金融・銀行', source: 'Google News' },
        { url: encodeURI('https://news.google.com/rss/search?q=メーカー+製造業+when:3d&hl=ja&gl=JP&ceid=JP:ja'), category: 'メーカー', source: 'Google News' },
        { url: encodeURI('https://news.google.com/rss/search?q=コンサルティング+when:3d&hl=ja&gl=JP&ceid=JP:ja'), category: 'コンサルティング', source: 'Google News' },
        { url: encodeURI('https://news.google.com/rss/search?q=広告+マーケティング+when:3d&hl=ja&gl=JP&ceid=JP:ja'), category: '広告・マーケティング', source: 'Google News' },
        { url: encodeURI('https://news.google.com/rss/search?q=小売+流通+when:3d&hl=ja&gl=JP&ceid=JP:ja'), category: '小売・流通', source: 'Google News' },
    ];

    const allNews: NewsItem[] = [];

    // 並列で取得して高速化
    await Promise.all(feeds.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);

            const items = await Promise.all(feedData.items.slice(0, 3).map(async (item) => {
                const articleUrl = item.link || '#';
                const articleTitle = item.title || 'タイトルなし';
                const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();

                let articleId = item.guid || articleUrl;
                try {
                    // Save article to database (upsert to avoid duplicates)
                    const savedArticle = await prisma.article.upsert({
                        where: { url: articleUrl },
                        update: {
                            title: articleTitle,
                            publishedAt,
                        },
                        create: {
                            title: articleTitle,
                            url: articleUrl,
                            sourceName: feed.source,
                            publishedAt,
                            category: feed.category,
                        }
                    });
                    articleId = savedArticle.id;
                } catch (dbError) {
                    console.warn(`[fetchNews] DB upsert failed for ${articleUrl}. Using fallback ID.`, dbError);
                }

                return {
                    id: articleId,
                    title: articleTitle,
                    summary: item.contentSnippet?.substring(0, 80) + '...' || '概要はありません',
                    date: publishedAt.toLocaleDateString('ja-JP'),
                    category: feed.category,
                    imageUrl: CATEGORY_IMAGES[feed.category] || CATEGORY_IMAGES['その他'],
                    url: articleUrl
                };
            }));

            allNews.push(...items);
        } catch (error) {
            console.error(`Error fetching ${feed.source}:`, error);
        }
    }));

    // 日付順にソート（新しい順）
    return allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}