import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsCard, NewsItem } from "@/components/news-card"
import { fetchLatestNews } from "@/utils/supabase/fetchNews"

// 1時間ごとにデータを再検証（キャッシュ更新）
export const revalidate = 3600;

export default async function NewsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    let userInterests: string[] = []

    if (user) {
        // Fetch user interests from DB if logged in
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { interests: true }
        })
        userInterests = dbUser?.interests || []
    }

    // サーバーサイドでデータを取得
    const allNewsItems = await fetchLatestNews();

    // ユーザーの興味に合わせてフィルタリング
    const filteredNewsItems = userInterests.length > 0
        ? allNewsItems.filter((item: NewsItem) => userInterests.includes(item.category))
        : allNewsItems;

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">最新ニュース一覧</h1>
                        <p className="text-muted-foreground text-lg">
                            志望業界の動向をキャッチアップし、面接での対話を深めましょう。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredNewsItems.length > 0 ? (
                            filteredNewsItems.map((news: NewsItem) => (
                                <NewsCard key={news.id} news={news} />
                            ))
                        ) : (
                            <div className="text-center col-span-full py-12">
                                <p className="text-muted-foreground text-lg mb-4">
                                    {userInterests.length > 0
                                        ? "あなたの興味に一致する最新ニュースは見つかりませんでした。"
                                        : "マイページで興味のあるジャンルを設定すると、パーソナライズされたニュースが表示されます。"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}