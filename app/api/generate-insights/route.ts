import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNewsInsights } from '@/lib/gemini';
export async function POST(request: NextRequest) {
    try {

        // ここでの summary は「RSSから取得した元の概要」
        const { articleId, title, summary } = await request.json();

        if (!articleId || !title || !summary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if insights already exist in DB (if DB is available)
        try {
            const existingInsight = await prisma.insight.findFirst({
                where: { articleId }
            });

            if (existingInsight) {
                return NextResponse.json(existingInsight);
            }
        } catch (dbError) {
            console.warn('[generate-insights] DB query failed, skipping DB lookup:', dbError);
        }

        // Generate insights using Gemini
        const insights = await generateNewsInsights(title, summary);

        // Try saving to database, fallback if DB is unreachable
        try {
            const newInsight = await prisma.insight.create({
                data: {
                    articleId,
                    summary: insights.summary,
                    opinionPositive: insights.opinionPositive,
                    opinionCritical: insights.opinionCritical
                }
            });
            return NextResponse.json(newInsight);
        } catch (dbError) {
            console.warn('[generate-insights] DB save failed, returning generated insights directly:', dbError);
            return NextResponse.json({
                articleId,
                summary: insights.summary,
                opinionPositive: insights.opinionPositive,
                opinionCritical: insights.opinionCritical
            });
        }
    } catch (error) {
        console.error('Error in generate-insights API:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
}