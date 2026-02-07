import './globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <nav className="bg-slate-800 text-white p-4">
          <div className="max-w-4xl mx-auto flex gap-6">
            <Link href="/" className="font-bold">🍜 Ramen Concierge</Link>
            <Link href="/search" className="hover:text-yellow-400">探す</Link>
            <Link href="/register" className="hover:text-yellow-400">登録</Link>
            <Link href="/dashboard" className="hover:text-yellow-400">管理</Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}