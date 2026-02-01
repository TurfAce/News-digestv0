export const INTEREST_GENRES = [
    "IT・テクノロジー",
    "ビジネス・経済",
    "金融・銀行",
    "メーカー",
    "コンサルティング",
    "広告・マーケティング",
    "小売・流通",
    "政治・社会",
    "キャリア・働き方",
    "国内ニュース",
    "国際情勢"
] as const

export type InterestGenre = typeof INTEREST_GENRES[number]
