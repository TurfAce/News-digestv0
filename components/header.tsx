"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const authAvailable = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "1") return;
    if (!authAvailable) return;
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser().catch(() => setUser(null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [authAvailable]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                ND
              </span>
            </div>
            <span className="font-bold text-foreground hidden sm:block">
              News Digest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/news"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ニュース
            </Link>
            <Link
              href="/#benefits"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              特徴
            </Link>
            <Link
              href="/#examples"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              使い方
            </Link>
            <Link
              href="/news?demo=1"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              デモ
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            {!authAvailable ? (
              <Button asChild>
                <Link href="/news">ニュースを読む</Link>
              </Button>
            ) : user ? (
              <Button asChild variant="ghost">
                <Link href="/mypage" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  マイページ
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">ログイン / 登録</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/news"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                ニュース
              </Link>
              <Link
                href="/#benefits"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                特徴
              </Link>
              <Link
                href="/#examples"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                使い方
              </Link>
              <Link
                href="/news?demo=1"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                デモ
              </Link>
              <Button asChild className="w-full mt-2">
                <Link href="/news">登録せずに使う</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
