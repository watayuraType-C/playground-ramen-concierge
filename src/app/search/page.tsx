"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

// 型定義
type SafeSearchRamenResult = {
  name: string;
  categories: string[];
  rating: number;
  location: string;
  review: string;
  similarity: number;
  ai_comment: string;
};

type SearchRamenResponse = {
  db_match: SafeSearchRamenResult[];
  web_match: SafeSearchRamenResult[];
};

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  text?: string;
  isInitial?: boolean;
  isLoading?: boolean;
  results?: SearchRamenResponse;
};

export default function SearchPage() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      role: "ai",
      text: "どんなラーメンが食べたい気分？🥢\nこってり系、あっさり系、場所などの希望を自由に教えてね！",
      isInitial: true,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 背景画像の設定
  const bg_image_class = isLoading
    ? "bg-[url('/images/bg-thinking.png')]"
    : messages.some((m) => m.results)
    ? "bg-[url('/images/bg-suggesting.png')]"
    : "bg-[url('/images/bg-waiting.png')]";

  useEffect(() => {
    // 最初のメッセージしかない（ページロード時）はスクロールしない
    if (messages.length > 1) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, bg_image_class]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText("");
    setIsLoading(true);

    // ユーザーメッセージを追加
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text: userText },
    ]);

    // ローディング用のAIメッセージを追加
    const loadingMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: loadingMsgId, role: "ai", isLoading: true },
    ]);

    try {
      const res = await fetch("/api/search-ramen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data: SearchRamenResponse = await res.json();

      // ローディングメッセージを結果メッセージに差し替え
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? { ...msg, isLoading: false, results: data }
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      // ローディングメッセージをエラーメッセージに差し替え
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? { ...msg, isLoading: false, text: "エラーが発生しちゃったみたい💦 もう一度試してみてね！" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderRamenCard = (result: SafeSearchRamenResult, title: string) => (
    <div className="h-full bg-white/50 border border-orange-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 transition-all hover:bg-white/80 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-orange-200 pb-2">
        <h4 className="text-orange-600 font-bold text-xs md:text-sm">{title}</h4>
        {result.similarity > 0 && (
          <span className="text-[10px] md:text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold">
            類似度: {Math.round(result.similarity * 100)}%
          </span>
        )}
      </div>
      <h3 className="text-lg md:text-xl font-black text-slate-800">{result.name}</h3>
      <div className="flex flex-wrap gap-1.5">
        {result.categories.map((cat, i) => (
          <span key={i} className="text-[10px] md:text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold leading-none">
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-yellow-500 font-black leading-none mt-1">⭐ {result.rating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></p>
      <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-tight">📍 {result.location}</p>
      
      <div className="bg-orange-50/80 p-3 rounded-lg border border-orange-100 flex-grow mt-2">
        <p className="text-[10px] md:text-xs text-orange-500 font-bold mb-1">💬 らーなびのヒトコト</p>
        <p className="text-xs md:text-sm text-slate-700 leading-snug">{result.ai_comment}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen relative overflow-x-hidden">
      
      {/* 1. 背景画像（素の画像、ぼかし無し） */}
      <div className={`fixed inset-0 z-0 bg-cover bg-center bg-fixed transition-all duration-700 ease-in-out ${bg_image_class}`}>
      </div>

      {/* グラデーション（上下の可読性用） */}
      <div className="fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-0"></div>
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-0"></div>

      {/* ヘッダータイトル */}
      <div className="relative z-10 w-full flex justify-center pt-8 mb-6 pointer-events-none shrink-0">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
              <h1 className="text-xl md:text-2xl font-extrabold text-orange-600 tracking-wider">おすすめのお店を探す</h1>
          </div>
      </div>

      {/* 2. チャット履歴エリア */}
      <div className="relative z-10 flex-grow flex flex-col px-2 sm:px-4 md:px-6 w-full gap-8 overflow-y-auto pb-40">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`w-full flex ${
                msg.role === "user" ? "justify-end pr-0 md:pr-4" : "justify-start pl-0 md:pl-4"
              } animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div 
                // キャラクターの顔（中央）を避けるため、最大幅をかなり絞り、ユーザー・AIで分ける
                className={`flex items-end gap-3 w-full max-w-[95%] md:max-w-[60%] lg:max-w-[45%] xl:max-w-[40%] ${
                  msg.role === "user" ? "flex-col items-end" : ""
                }`}
              >
                
                {/* AIアイコン (左側表示) */}
                {msg.role === "ai" && (
                  <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.4)] bg-slate-800 hidden sm:block">
                    <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className={`w-full rounded-3xl py-4 px-6 md:py-6 md:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-tl from-orange-50 to-white text-slate-800 rounded-br-sm border border-slate-200"
                      : "bg-white/95 text-slate-800 rounded-bl-sm border-2 border-orange-300"
                  }`}
                >
                  {/* スマホレイアウト用 AIアイコン(内側) */}
                  {msg.role === "ai" && (
                      <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-orange-300 shadow bg-slate-800 sm:hidden block mb-3 -ml-2 -mt-2">
                        <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                      </div>
                  )}

                  {msg.text && (
                      <p className="whitespace-pre-wrap font-bold text-sm md:text-lg leading-relaxed">{msg.text}</p>
                  )}

                  {msg.isLoading && (
                    <div className="flex items-center gap-2 text-orange-500 font-bold">
                      <span className="text-xl animate-pulse">🍜</span>
                      <span>至高の一杯を探しているよ...</span>
                    </div>
                  )}

                  {msg.results && (
                    <div className="flex flex-col gap-4 mt-2">
                      <p className="font-extrabold text-orange-600 text-base md:text-lg flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        お待たせ！こんなお店はどうかな？
                      </p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {msg.results.db_match.map((match, i) => (
                          <div key={`db-${i}`} className="h-full">
                            {renderRamenCard(match, "✅ あなたの好みに近いお店（DBより）")}
                          </div>
                        ))}

                        {msg.results.web_match.map((match, i) => (
                          <div key={`web-${i}`} className="h-full">
                            {renderRamenCard(match, "🌐 ネットで見つけたおすすめのお店")}
                          </div>
                        ))}
                      </div>
                      
                      {msg.results.db_match.length === 0 && msg.results.web_match.length === 0 && (
                        <p className="text-orange-500 font-bold mt-2 bg-orange-50 p-4 rounded-xl">ごめんなさい、条件に合うお店が見つからなかったみたい💦</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />

          {/* 3. 入力フォーム (下部固定を廃止し、チャットフローに右端で続ける) */}
          <div className="w-full flex justify-end pr-0 md:pr-4 mt-6 pb-20">
            <div className="flex flex-col items-end w-full max-w-[95%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[32%]">
                <div className="w-full bg-gradient-to-tl from-orange-50 to-white border border-slate-200 rounded-3xl rounded-br-sm p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isLoading}
                        placeholder="例：新宿の濃厚な豚骨ラーメンが食べたい！"
                        className="w-full h-32 md:h-40 bg-white border border-slate-300 rounded-2xl p-4 text-slate-800 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-orange-300/50 shadow-inner resize-none transition-all"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isLoading}
                            className="bg-orange-500 text-white font-extrabold text-sm md:text-base py-3 px-8 rounded-full hover:bg-orange-600 hover:scale-105 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] disabled:bg-slate-300 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300"
                        >
                            {isLoading ? '解析中... 💭' : '送信する！'}
                        </button>
                    </div>
                </div>
            </div>
          </div>
      </div>
    
    </div>
  );
}