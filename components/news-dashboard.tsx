"use client"

import { useEffect, useMemo, useState } from "react"
import { BookmarkCheck, BriefcaseBusiness, Filter, Newspaper, Search, Sparkles, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { INTEREST_GENRES } from "@/lib/constants"
import { NewsCard, type NewsItem } from "@/components/news-card"
import { cn } from "@/lib/utils"

interface NewsDashboardProps {
    newsItems: NewsItem[]
    userInterests: string[]
}

const STORAGE_KEY = "news-digest:saved-articles"

function uniqueCategories(newsItems: NewsItem[]) {
    const categories = new Set(newsItems.map((item) => item.category))
    return INTEREST_GENRES.filter((genre) => categories.has(genre))
}

export function NewsDashboard({ newsItems, userInterests }: NewsDashboardProps) {
    const [query, setQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("すべて")
    const [savedIds, setSavedIds] = useState<string[]>([])
    const [showSavedOnly, setShowSavedOnly] = useState(false)

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved) {
            setSavedIds(JSON.parse(saved) as string[])
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    }, [savedIds])

    const categories = useMemo(() => uniqueCategories(newsItems), [newsItems])
    const savedSet = useMemo(() => new Set(savedIds), [savedIds])
    const featuredArticle = newsItems[0]

    const filteredNewsItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()

        return newsItems.filter((item) => {
            const matchesCategory = activeCategory === "すべて" || item.category === activeCategory
            const matchesSaved = !showSavedOnly || savedSet.has(item.id)
            const matchesQuery =
                normalizedQuery.length === 0 ||
                `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(normalizedQuery)

            return matchesCategory && matchesSaved && matchesQuery
        })
    }, [activeCategory, newsItems, query, savedSet, showSavedOnly])

    const toggleSaved = (id: string) => {
        setSavedIds((current) =>
            current.includes(id)
                ? current.filter((savedId) => savedId !== id)
                : [...current, id]
        )
    }

    const hasFilters = query.length > 0 || activeCategory !== "すべて" || showSavedOnly

    const clearFilters = () => {
        setQuery("")
        setActiveCategory("すべて")
        setShowSavedOnly(false)
    }

    return (
        <div className="space-y-8">
            <section className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 overflow-hidden border-accent/30 bg-card">
                    <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_220px] md:items-center">
                        <div className="space-y-3">
                            <Badge variant="secondary" className="w-fit">
                                <Sparkles className="mr-1 h-3 w-3" />
                                今日の注目
                            </Badge>
                            <div>
                                <h2 className="line-clamp-2 text-2xl font-bold leading-tight">
                                    {featuredArticle?.title ?? "注目記事はまだありません"}
                                </h2>
                                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                    {featuredArticle?.summary ?? "ニュースを取得できると、最初に読むべき記事をここに表示します。"}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {userInterests.length > 0 ? (
                                    userInterests.map((interest) => (
                                        <Badge key={interest} variant="outline">
                                            {interest}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="outline">ジャンル未設定</Badge>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
                            <Metric icon={Newspaper} label="記事" value={`${newsItems.length}`} />
                            <Metric icon={BriefcaseBusiness} label="対象ジャンル" value={`${categories.length}`} />
                            <Metric icon={BookmarkCheck} label="保存済み" value={`${savedIds.length}`} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">キャッチアップ状況</p>
                            <p className="mt-2 text-3xl font-bold">{filteredNewsItems.length}</p>
                            <p className="text-sm text-muted-foreground">現在の条件に合う記事</p>
                        </div>
                        <Button
                            type="button"
                            variant={showSavedOnly ? "default" : "outline"}
                            onClick={() => setShowSavedOnly((value) => !value)}
                            className="w-full"
                        >
                            <BookmarkCheck className="h-4 w-4" />
                            あとで読む
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="キーワードで検索"
                            className="h-10 pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {["すべて", ...categories].map((category) => (
                            <Button
                                key={category}
                                type="button"
                                variant={activeCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(category)}
                                className={cn("shrink-0", userInterests.includes(category) && activeCategory !== category && "border-accent/60")}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    {hasFilters && (
                        <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4" />
                            クリア
                        </Button>
                    )}
                </div>

                {filteredNewsItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {filteredNewsItems.map((news, index) => (
                            <NewsCard
                                key={news.id}
                                news={news}
                                isSaved={savedSet.has(news.id)}
                                onToggleSaved={toggleSaved}
                                priority={index < 3}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed bg-card p-10 text-center">
                        <p className="text-lg font-medium">条件に合うニュースはありません</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            検索語やジャンルを変えると、別の記事が見つかります。
                        </p>
                        {hasFilters && (
                            <Button type="button" variant="outline" className="mt-5" onClick={clearFilters}>
                                条件をリセット
                            </Button>
                        )}
                    </div>
                )}
            </section>
        </div>
    )
}

function Metric({ icon: Icon, label, value }: { icon: typeof Newspaper; label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-background/60 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>
            <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
    )
}
