import { Clock, MessageSquare, Zap } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "毎朝5分でキャッチアップ",
    description: "業界の最新ニュースを厳選してお届け。忙しい就活生でも、朝の5分で重要な情報をすべて把握できます。",
  },
  {
    icon: MessageSquare,
    title: "AIが意見案を自動生成",
    description: "「このニュースについてどう思いますか?」への回答例をAIが生成。自分の言葉にアレンジするだけでOK。",
  },
  {
    icon: Zap,
    title: "志望業界に完全特化",
    description: "IT、コンサル、金融など、あなたの志望業界に特化したニュースだけを配信。無駄な情報は一切ありません。",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            面接対策の常識を変える
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            News Digest for Interviewが選ばれる3つの理由
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-8 border border-border hover:border-accent/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                <benefit.icon className="w-7 h-7 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
