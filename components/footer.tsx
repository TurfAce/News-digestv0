export function Footer() {
  return (
    <footer className="py-12 px-4 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ND</span>
            </div>
            <span className="font-bold">News Digest for Interview</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              利用規約
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              お問い合わせ
            </a>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © 2026 News Digest for Interview. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
