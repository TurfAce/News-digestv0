import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateNewsInsights(title: string, summary: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
あなたはニュース分析の専門家です。以下のニュース記事について、就職活動中の学生が面接で話すために理解すべき重要なポイントを分析してください。

タイトル: ${title}
概要: ${summary}

以下の形式で回答してください:
それぞれの文字数を最大100文字程度とします
【要約】
- (ニュースの内容を、背景知識がない人にも伝わるように3行程度で要約)

【良い点・ポジティブな側面】
- (箇条書きで1-2点、できるだけ簡潔に)

【懸念点・注意すべき側面】
- (箇条書きで1-2点、できるだけ簡潔に)
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse the response using Regex
        // 【要約】から【良い点】の間を取得
        const summaryMatch = text.match(/【要約】\n([\s\S]*?)(?=【良い点)/);
        // 【良い点】から【懸念点】の間を取得
        const positiveMatch = text.match(/【良い点・ポジティブな側面】\n([\s\S]*?)(?=【懸念点)/);
        // 【懸念点】以降を取得
        const criticalMatch = text.match(/【懸念点・注意すべき側面】\n([\s\S]*?)$/);

        return {
            // マッチしなかった場合は、元々のsummary（RSS等から来たもの）をフォールバックとして返すのが安全です
            summary: summaryMatch ? summaryMatch[1].trim() : summary,
            opinionPositive: positiveMatch ? positiveMatch[1].trim() : '',
            opinionCritical: criticalMatch ? criticalMatch[1].trim() : '',
            fullText: text
        };
    } catch (error) {
        console.error('Error generating insights:', error);
        // エラー時は最低限元のsummaryだけは返すなどの処理推奨
        throw new Error('Failed to generate insights');
    }
}