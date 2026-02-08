import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* ヒーローセクション（メインビジュアル） */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="max-w-4xl space-y-8">
          
          <div className="text-7xl animate-bounce mb-4">🍜</div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ramen Concierge
            <span className="block text-blue-600 text-2xl md:text-3xl mt-4 font-bold">
              AI × ログ管理で、最高の一杯を。
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            あなたが食べたラーメンの記録をAIが学習。<br className="hidden md:block"/>
            「あの店のあれが好きなら、これも好きなはず」<br className="hidden md:block"/>
            あなたの好みを熟知した専属コンシェルジュが、次の名店を提案します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/search"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              🔍 コンシェルジュに相談する
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full shadow border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              📝 ラーメンログを管理する
            </Link>
          </div>
        </div>
      </main>

      {/* 機能紹介セクション */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-12">
            3つのステップで好みを分析
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📂"
              title="1. 記録する"
              desc="食べたラーメンの感想を記録。AIがあなたの言葉をベクトル化し、味の好みをデータとして蓄積します。"
            />
            <FeatureCard
              icon="🧠"
              title="2. 検索する"
              desc="「今日はこってり系」と伝えるだけ。過去のログから、今の気分にベストマッチするお店を瞬時に抽出。"
            />
            <FeatureCard
              icon="🌐"
              title="3. 発見する"
              desc="RAG技術により、あなたの好みを踏まえた上で、Web上の膨大な知識から「まだ見ぬ名店」を提案します。"
            />
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 text-center text-slate-400 text-sm bg-slate-50 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} Ramen Concierge. Powered by Gemini & Supabase.</p>
      </footer>
    </div>
  );
}

// 機能カードコンポーネント
function FeatureCard({icon, title, desc}: {icon: string, title: string, desc: string}) {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}