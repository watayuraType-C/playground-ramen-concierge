import type { Metadata } from "next";
import { Home, Search, Pen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "僕のラーメンコンシェルジュ",
  description: "AIと一緒にラーメン屋を探す・記録するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen relative text-slate-100 font-sans">
        {/* 背景画像とフィルター */}
        <div className="fixed inset-0 z-[-1] bg-[url('/images/background.png')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        </div>

        {/* 1. 共通ヘッダー（上部固定） */}
        <header className="fixed top-0 inset-x-0 h-16 bg-slate-900/80 backdrop-blur-md z-50 border-b border-orange-500/30">
          <div className="max-w-md mx-auto h-full flex items-center justify-around px-4">
            <Link href="/" className="p-2 text-slate-300 hover:text-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] rounded-full transition-all duration-300">
              <Home size={26} />
            </Link>
            <Link href="/search" className="p-2 text-slate-300 hover:text-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] rounded-full transition-all duration-300">
              <Search size={26} />
            </Link>
            <Link href="/register" className="p-2 text-slate-300 hover:text-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] rounded-full transition-all duration-300">
              <Pen size={26} />
            </Link>
            <Link href="/dashboard" className="p-2 text-slate-300 hover:text-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.8)] rounded-full transition-all duration-300">
              <LayoutDashboard size={26} />
            </Link>
          </div>
        </header>

        {/* メインコンテンツエリア: max-w-md, mx-auto でスマホアプリ風の中央配置カラム */}
        <main className="pt-20 pb-10 max-w-md mx-auto min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}