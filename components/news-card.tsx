"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NewsInsights } from "@/components/news-insights"
import { Button } from "@/components/ui/button"

export interface NewsItem {
    id: string
    title: string
    summary: string
    date: string
    category: string
    imageUrl: string
    url: string
}

interface NewsCardProps {
    news: NewsItem
    isSaved?: boolean
    onToggleSaved?: (id: string) => void
    priority?: boolean
}

export function NewsCard({ news, isSaved, onToggleSaved, priority }: NewsCardProps) {
    const [showInsights, setShowInsights] = useState(false)

    return (
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {news.category}
                    </Badge>
                </div>
            </div>
            <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <time dateTime={news.date}>{news.date}</time>
                </div>
                <CardTitle className="line-clamp-2">
                    {news.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                    {news.summary}
                </p>

                <div className="flex gap-2">
                    <Link href={news.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            記事を読む
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInsights(!showInsights)}
                        className="flex-1"
                    >
                        {showInsights ? <ChevronUp className="mr-2 h-3 w-3" /> : <ChevronDown className="mr-2 h-3 w-3" />}
                        AI分析
                    </Button>
                </div>

                {showInsights && (
                    <div className="pt-4 border-t">
                        <NewsInsights
                            articleId={news.id}
                            title={news.title}
                            summary={news.summary}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
