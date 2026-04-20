import Link from "next/link";
import { Search, Pen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 pb-12 pt-8 relative flex-grow overflow-x-hidden">
      
      {/* ルートページ専用の背景（素の画像使用、ぼかし無し） */}
      <div className="fixed inset-0 z-0 bg-[url('/images/bg-happy.png')] bg-cover bg-center bg-fixed">
        {/* 素の画像を引き立たせるため、暗いオーバーレイを少しだけ引くか、もしくは空にする */}
        {/* 背景の文字とチャットが被ると見づらいため、極薄い黒か白のグラデーションのみにする */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* メインコンテンツ - チャット風レイアウト（キャラにかぶらないよう幅広に） */}
      <div className="relative z-10 flex flex-col w-full max-w-7xl gap-12">

        {/* 1. ロゴエリア (中央配置) */}
        <div className="w-full flex justify-center mt-2 mb-8">
          <img
            src="/images/logo.png"
            alt="僕のラーメンコンシェルジュ ロゴ"
            className="w-full max-w-[360px] md:max-w-[550px] h-auto drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 2. ご挨拶チャットUI（より左寄せへ / 幅を占有してキャラと被らないように） */}
        <div className="w-full flex justify-start pl-2 md:pl-4">
          <div className="flex items-end gap-3 max-w-[90%] md:max-w-[60%] lg:max-w-[50%]">
            <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.4)] bg-slate-800">
              <img
                src="/images/icon.png"
                alt="らーなびちゃんアイコン"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="self-start bg-white border border-slate-200 rounded-3xl rounded-bl-sm py-3 px-5 md:py-4 md:px-6 text-slate-800 text-sm md:text-lg font-bold shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <p>やっほー！らーなびだよ🍜✨</p>
              </div>
              <div className="self-start bg-white border border-slate-200 rounded-3xl rounded-bl-sm py-4 px-6 md:py-5 md:px-8 text-slate-800 text-sm md:text-lg font-bold shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <p className="leading-relaxed">
                  おすすめのラーメン屋さんを探す？<br />
                  それとも、行ったお店を記録する？<br />
                  <span className="text-orange-500 text-xs md:text-sm mt-1 block">（右側の選択肢からタップしてね！）</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. アクション選択UI（より右寄せへ / キャラと被らずに対話感を出す） */}
        <div className="w-full flex justify-end pr-2 md:pr-4 mt-4 md:mt-10">
          <div className="flex flex-col items-end gap-4 w-full md:max-w-[60%] lg:max-w-[50%]">
            
            <Link href="/search" className="block w-full sm:w-auto group">
              <div className="flex items-center justify-end gap-4 bg-gradient-to-l from-orange-100 to-white border-2 border-orange-200 rounded-3xl rounded-br-sm py-4 px-6 md:py-5 md:px-8 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] group-hover:scale-105 group-hover:border-orange-400 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="font-extrabold tracking-wider text-base md:text-xl text-orange-600">おすすめのお店を探す！</span>
                  <span className="text-xs md:text-sm text-slate-500 font-medium">条件を入力してAIに探してもらいたい</span>
                </div>
                <div className="p-3 bg-white rounded-full group-hover:bg-orange-500 transition-colors duration-300 shadow-sm border border-orange-100">
                  <Search className="text-orange-500 group-hover:text-white transition-colors" size={28} />
                </div>
              </div>
            </Link>

            <Link href="/register" className="block w-full sm:w-auto group mt-2">
              <div className="flex items-center justify-end gap-4 bg-gradient-to-l from-orange-100 to-white border-2 border-orange-200 rounded-3xl rounded-br-sm py-4 px-6 md:py-5 md:px-8 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] group-hover:scale-105 group-hover:border-orange-400 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="font-extrabold tracking-wider text-base md:text-xl text-orange-600">行ったお店を登録する！</span>
                  <span className="text-xs md:text-sm text-slate-500 font-medium">感想を日記のように書き残したい</span>
                </div>
                <div className="p-3 bg-white rounded-full group-hover:bg-orange-500 transition-colors duration-300 shadow-sm border border-orange-100">
                  <Pen className="text-orange-500 group-hover:text-white transition-colors" size={28} />
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}