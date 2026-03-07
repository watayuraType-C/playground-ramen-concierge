import Link from "next/link";
import { Search, Pen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* 2. ロゴエリア */}
      <div className="w-full mt-4 mb-8 flex justify-center">
        <img 
          src="/images/logo.png" 
          alt="僕のラーメンコンシェルジュ ロゴ" 
          className="w-full max-w-[280px] h-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
        />
      </div>

      {/* 3. キャラクターエリア */}
      <div className="w-full flex justify-center mb-10">
        <img 
          src="/images/happy.png" 
          alt="らーなびちゃん" 
          className="w-56 h-auto drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 4. チャットUI（案内） */}
      <div className="w-full flex items-start gap-4 mb-10 pl-2 pr-4">
        {/* アイコン */}
        <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]">
          <img 
            src="/images/icon.png" 
            alt="らーなびちゃんアイコン" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* 吹き出し */}
        <div className="relative bg-slate-800/90 border border-orange-500 rounded-2xl rounded-tl-sm p-4 text-slate-100 text-sm md:text-base leading-relaxed shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          <p>
            おすすめラーメン屋を知りたいですか？<br/>
            もしくは、ラーメン屋を登録したいですか？
          </p>
        </div>
      </div>

      {/* 5. アクションボタン（ユーザーの選択） */}
      <div className="w-full flex flex-col gap-6 px-2">
        <Link href="/search" className="block w-full">
          <button className="w-full flex items-center justify-center gap-3 bg-slate-900 border border-orange-500 text-slate-100 py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-105 transition-all duration-300 group">
            {/* 上記emojiの指示通り、文字部分に含めるかここでアイコンを使う。両方使ってもOK。 */}
            <span className="font-bold tracking-wide text-[15px] md:text-lg">🔍 おすすめのラーメン屋を探す</span>
          </button>
        </Link>
        <Link href="/register" className="block w-full">
          <button className="w-full flex items-center justify-center gap-3 bg-slate-900 border border-orange-500 text-slate-100 py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-105 transition-all duration-300 group">
            <span className="font-bold tracking-wide text-[15px] md:text-lg">✍️ 行ったラーメン屋を登録する</span>
          </button>
        </Link>
      </div>
    </div>
  );
}