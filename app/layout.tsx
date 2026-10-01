import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "News Digest for Interview | 面接ネタ特化ニュース",
  description:
    "登録不要。志望業界のニュースを探し、根拠を確かめながらAIと自分の視点を整理するニュースアプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
