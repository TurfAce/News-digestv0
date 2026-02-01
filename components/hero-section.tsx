"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const [email, setEmail] = useState("")
  const [industry, setIndustry] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">AIが毎朝お届け</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              面接で差がつく
              <br />
              <span className="text-accent">業界ニュース</span>を
              <br />
              毎朝お届け
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              志望業界の最新ニュースと、面接で使える「自分の意見案」をAIが毎朝生成。もう情報収集に時間をかける必要はありません。
            </p>
          </div>

          {/* Right: Registration Form */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">登録完了!</h3>
                <p className="text-muted-foreground">
                  明日の朝から、あなたの志望業界のニュースをお届けします。
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  無料で始める
                </h2>
                <p className="text-muted-foreground mb-6">
                  30秒で登録完了。クレジットカード不要。
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      メールアドレス
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="industry" className="text-sm font-medium text-foreground">
                      志望業界
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      required
                      className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">選択してください</option>
                      <option value="it">IT・テクノロジー</option>
                      <option value="consulting">コンサルティング</option>
                      <option value="finance">金融・銀行</option>
                      <option value="trading">商社</option>
                      <option value="manufacturing">メーカー</option>
                      <option value="advertising">広告・マーケティング</option>
                      <option value="media">メディア・出版</option>
                      <option value="retail">小売・流通</option>
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "登録中..."
                    ) : (
                      <>
                        無料で登録する
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  登録することで、利用規約とプライバシーポリシーに同意したものとみなされます。
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
