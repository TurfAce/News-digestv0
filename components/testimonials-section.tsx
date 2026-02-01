import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "面接で「最近気になるニュースは?」と聞かれたとき、このサービスで読んだ記事と意見案をもとに話したら、面接官に感心されました。",
    name: "田中 優花",
    role: "早稲田大学 / IT業界内定",
    initial: "T",
  },
  {
    quote: "毎朝の情報収集が本当に楽になりました。特にAIの意見案は、自分の考えを深めるきっかけになって重宝しています。",
    name: "鈴木 健太",
    role: "慶應義塾大学 / コンサル業界内定",
    initial: "S",
  },
  {
    quote: "金融業界志望で、日経を読む習慣がなかった私でも、このサービスのおかげで業界知識を深められました。第一志望から内定もらえました!",
    name: "佐藤 美咲",
    role: "東京大学 / メガバンク内定",
    initial: "S",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            内定者の声
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            実際にNews Digest for Interviewを使って内定を獲得した先輩たちの声
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 border border-border relative"
            >
              <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />
              <p className="text-foreground leading-relaxed mb-6 relative z-10">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {testimonial.initial}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
