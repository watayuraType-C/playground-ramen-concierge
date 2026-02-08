// src/app/search/ResultCard.tsx
import { SearchRamenResult } from "./types";

type Props = {
  data: SearchRamenResult;
  type: "db" | "web"; // どっちのソースか見分ける用
};

export function ResultCard({ data, type }: Props) {
  // DBなら青系、Webなら緑系のアクセントカラー
  const accent_color = type === "db" ? "border-l-blue-500" : "border-l-green-500";
  const bg_color = type === "db" ? "bg-blue-50" : "bg-green-50";
  const label = type === "db" ? "あなたのログ" : "AIのWeb提案";

  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm p-4 border-l-4 ${accent_color}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-slate-600 mb-1 inline-block ${bg_color}`}>
            {label}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{data.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-yellow-500 font-bold text-lg">
            {"★".repeat(data.rating)}
            <span className="text-slate-300">{"★".repeat(5 - data.rating)}</span>
          </div>
          <div className="text-xs text-slate-400">類似度: {(data.similarity * 100).toFixed(0)}%</div>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-2">📍 {data.location}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {data.categories.map((c) => (
          <span key={c} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
            {c}
          </span>
        ))}
      </div>

      {/* AIコメントエリア */}
      <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 border border-slate-100">
        <p className="font-bold text-xs text-slate-400 mb-1">🤖 コンシェルジュのメモ</p>
        {data.ai_comment}
      </div>
    </div>
  );
}