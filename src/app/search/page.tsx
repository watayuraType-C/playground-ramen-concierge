// src/app/search/page.tsx
'use client'
import { useState } from "react";
import { SearchResponse } from "./types";
import { ResultCard } from "./ResultCard";
import { call_search_ramen_api } from "./call_search_ramen_api";

export default function SearchPage() {
  // 仕様書の default 値
  const [query, set_query] = useState("とんこつ醤油ラーメンで最高においしいのが食べたい。");
  const [is_searching, set_is_searching] = useState(false);
  const [results, set_results] = useState<SearchResponse | null>(null);

const handle_search = async () => {
    if (!query.trim()) return;
    set_is_searching(true);
    set_results(null);

    try {
      // ★ここを本物のAPI呼び出しに変更
      const data = await call_search_ramen_api(query);
      set_results(data);

    } catch (error) {
      // エラー発生時はアラートを表示
      alert(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
    } finally {
      set_is_searching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen pb-20">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">🍜 ラーメン・コンシェルジュ</h1>

      {/* 検索フォームエリア */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-4 z-10">
        <label className="block text-sm font-bold text-slate-600 mb-2">
          今の気分を教えてください
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-lg p-3 h-24 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          value={query}
          onChange={(e) => set_query(e.target.value)}
          placeholder="例：新宿付近で、さっぱりした塩ラーメンが食べたい"
        />
        <button
          onClick={handle_search}
          disabled={is_searching || !query.trim()}
          className="w-full mt-3 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 flex justify-center items-center gap-2"
        >
          {is_searching ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>AIが思考中...</span>
            </>
          ) : (
            "コンシェルジュに相談する"
          )}
        </button>
      </div>

      {/* 結果表示エリア */}
      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. 自分のログからの推薦 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
              📂 あなたのラーメンログからの提案
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{results.db_match.length}件</span>
            </h2>
            <div className="flex flex-col gap-4">
              {results.db_match.length > 0 ? (
                results.db_match.map((item, idx) => (
                  <ResultCard key={`db-${idx}`} data={item} type="db" />
                ))
              ) : (
                <p className="text-slate-500 text-sm p-4 bg-slate-50 rounded">条件に合う過去のログは見つかりませんでした。</p>
              )}
            </div>
          </section>

          {/* 2. Webからの提案 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
              🌐 AIが見つけた新しいお店
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{results.web_match.length}件</span>
            </h2>
            <div className="flex flex-col gap-4">
              {results.web_match.length > 0 ? (
                results.web_match.map((item, idx) => (
                  <ResultCard key={`web-${idx}`} data={item} type="web" />
                ))
              ) : (
                <p className="text-slate-500 text-sm p-4 bg-slate-50 rounded">AIからの追加提案はありませんでした。</p>
              )}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}