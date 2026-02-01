import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNewsInsights } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ここでの summary は「RSSから取得した元の概要」
        const { articleId, title, summary } = await request.json();

        if (!articleId || !title || !summary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if insights already exist
        const existingInsight = await prisma.insight.findFirst({
            where: { articleId }
        });

        if (existingInsight) {
            return NextResponse.json(existingInsight);
        }

        // Generate insights using Gemini
        // ここで insights オブジェクトに { summary, opinionPositive, opinionCritical } が入ってくる
        const insights = await generateNewsInsights(title, summary);

        // Save to database
        const newInsight = await prisma.insight.create({
            data: {
                articleId,
                // 【修正箇所】
                // 以前: summary: `${title}\n\n${summary}`,
                // 修正: AIが生成した要約を使用する
                summary: insights.summary,

                opinionPositive: insights.opinionPositive,
                opinionCritical: insights.opinionCritical
            }
        });

        return NextResponse.json(newInsight);
    } catch (error) {
        console.error('Error in generate-insights API:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
}