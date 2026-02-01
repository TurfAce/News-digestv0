"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, ThumbsUp, AlertTriangle, FileText } from "lucide-react" // FileTextを追加

interface NewsInsightsProps {
    articleId: string
    title: string
    summary: string // これはRSS由来の元の概要
}

interface Insight {
    summary: string | null // 追加: AI生成された要約
    opinionPositive: string | null
    opinionCritical: string | null
}

export function NewsInsights({ articleId, title, summary }: NewsInsightsProps) {
    const [insights, setInsights] = useState<Insight | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerateInsights = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/generate-insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    articleId,
                    title,
                    summary,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate insights')
            }

            const data = await response.json()
            setInsights(data)
        } catch (err) {
            setError('インサイトの生成に失敗しました。もう一度お試しください。')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {!insights && !loading && (
                <Button
                    onClick={handleGenerateInsights}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AIで分析する
                </Button>
            )}

            {loading && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm text-muted-foreground">分析中...</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                </Card>
            )}

            {insights && (
                <div className="space-y-4">
                    {/* ここに要約カードを追加 */}
                    {insights.summary && (
                        <Card className="bg-slate-50 dark:bg-slate-900/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    AI要約
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                                    {insights.summary}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {insights.opinionPositive && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ThumbsUp className="h-4 w-4 text-green-600" />
                                    良い点・ポジティブな側面
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                                    {insights.opinionPositive}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {insights.opinionCritical && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    懸念点・注意すべき側面
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                                    {insights.opinionCritical}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}