import Link from "next/link";
import { Search, Pen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full px-4 relative h-full flex-grow">

      {/* 1. キャラクターを絶対配置で大きく表示し、下半身を隠す構成 */}
      {/* Containerをrelativeにし、キャラクターを背面に置く。下のコンテンツが上に被さる */}
      <div className="absolute top-10 inset-x-0 w-full flex justify-center z-0 pointer-events-none">
        <img
          src="/images/happy.png"
          alt="らーなびちゃん"
          className="w-[120%] max-w-[400px] h-auto drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] translate-y-12 md:translate-y-8"
        />
      </div>

      {/* 前面のレイヤー（ロゴ、チャット、ボタン）は相対配置＋z-indexで被せる */}
      <div className="relative z-10 flex flex-col items-center w-full h-full">

        {/* 2. ロゴエリア (マージン削減) */}
        <div className="w-full mt-2 mb-28 flex justify-center">
          <img
            src="/images/logo.png"
            alt="僕のラーメンコンシェルジュ ロゴ"
            className="w-full max-w-[260px] h-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
          />
        </div>

        {/* スペーサー（キャラクターの顔部分を見せるための空間） */}
        <div className="flex-grow min-h-[160px]"></div>

        {/* 3. チャットUI（案内）可愛く分割 */}
        <div className="w-full flex items-end gap-3 mb-6">
          {/* アイコン */}
          <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)] bg-slate-800">
            <img
              src="/images/icon.png"
              alt="らーなびちゃんアイコン"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 吹き出しコンテナ */}
          <div className="flex flex-col gap-2 w-full">
            <div className="self-start relative bg-slate-800/95 border border-orange-500/80 rounded-2xl rounded-bl-sm p-3 text-slate-100 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <p>やっほー！らーなびだよ🍜✨</p>
            </div>
            <div className="self-start relative bg-slate-800/95 border border-orange-500/80 rounded-2xl rounded-bl-sm p-3 text-slate-100 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <p>
                おすすめのラーメン屋さんを探す？<br />
                それとも、行ったお店を記録する？
              </p>
            </div>
          </div>
        </div>

        {/* 4. アクションボタン（2つ横並び） スマホでも押しやすいように */}
        <div className="w-full grid grid-cols-2 gap-3 pb-4">
          <Link href="/search" className="block w-full h-full">
            <button className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900/90 border border-orange-500 text-slate-100 py-4 px-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
              <Search className="text-orange-400 group-hover:text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-colors" size={28} />
              <span className="font-bold tracking-wide text-xs md:text-sm text-center leading-tight">おすすめのお店<br />を探す</span>
            </button>
          </Link>
          <Link href="/register" className="block w-full h-full">
            <button className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900/90 border border-orange-500 text-slate-100 py-4 px-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
              <Pen className="text-orange-400 group-hover:text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-colors" size={28} />
              <span className="font-bold tracking-wide text-xs md:text-sm text-center leading-tight">行ったお店を<br />登録する</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}