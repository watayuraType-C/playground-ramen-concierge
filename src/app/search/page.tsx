"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Pen, Send } from "lucide-react";

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
      text: "どんなラーメン屋にいきたいですか？",
      isInitial: true,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // キャラクター画像の状態管理
  const characterImage = isLoading
    ? "/images/thinking.png"
    : messages.some((m) => m.results)
    ? "/images/suggesting.png"
    : "/images/waiting.png";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, characterImage]);

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
    <div className="h-full bg-slate-700/95 border border-orange-400 rounded-xl p-3 shadow-[0_0_12px_rgba(249,115,22,0.6)] flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-orange-400/50 pb-1">
        <h4 className="text-orange-300 font-bold text-xs md:text-sm">{title}</h4>
        {result.similarity > 0 && (
          <span className="text-[10px] md:text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">
            類似度: {Math.round(result.similarity * 100)}%
          </span>
        )}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-50">{result.name}</h3>
      <div className="flex flex-wrap gap-1.5">
        {result.categories.map((cat, i) => (
          <span key={i} className="text-[10px] md:text-xs bg-slate-600 text-slate-200 px-1.5 py-0.5 rounded leading-none">
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-yellow-500 font-bold leading-none">⭐ {result.rating} <span className="text-xs text-slate-300">/ 5.0</span></p>
      <p className="text-xs md:text-sm text-slate-200 line-clamp-2 leading-tight">📍 {result.location}</p>
      
      <div className="bg-slate-800/80 p-2 rounded border border-slate-600 flex-grow mt-1">
        <p className="text-[10px] md:text-xs text-orange-300 font-bold mb-0.5">💬 らーなびのヒトコト</p>
        <p className="text-xs md:text-sm text-slate-100 leading-snug">{result.ai_comment}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full relative flex-grow overflow-x-hidden">
      
      {/* 1. キャラクターを絶対配置で極大表示し、背面に置く */}
      <div className="absolute top-0 inset-x-0 w-full flex justify-center z-0 pointer-events-none">
        <img
          src={characterImage}
          alt="らーなびちゃん"
          className="w-[180%] max-w-[700px] md:max-w-[1000px] h-auto drop-shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-opacity duration-300 translate-y-2 md:translate-y-8"
        />
      </div>

      {/* 2. チャットエリア (前面レイヤー) */}
      <div className="relative z-10 flex-grow flex flex-col px-2 md:px-6 w-full max-w-5xl mx-auto">
        
        {/* キャラクターの顔部分を見せるためのスペーサー */}
        <div className="w-full shrink-0 min-h-[220px] md:min-h-[350px]"></div>

        <div className="flex flex-col gap-2 md:gap-3 pb-2 w-full">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.7)] bg-slate-800 mr-2 mt-0.5">
                  <img
                    src="/images/icon.png"
                    alt="らーなびちゃんアイコン"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[90%] md:max-w-[80%] relative rounded-xl py-2 px-3 md:py-3 md:px-5 text-sm md:text-base leading-snug shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-md ${
                  msg.role === "user"
                    ? "bg-slate-600/95 text-white rounded-br-sm border border-slate-500" // ユーザー: やや明るいslate
                    : "bg-slate-700/95 text-slate-50 rounded-bl-sm border border-orange-400/90" // AI: 明るめのslate
                }`}
              >
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                {msg.isLoading && (
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                    <span>至高の一杯を探しています...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}

                {msg.results && (
                  <div className="flex flex-col gap-2 mt-1">
                    <p className="font-bold text-orange-200">お待たせしました！こちらのラーメンはいかがですか？🍜✨</p>
                    
                    {/* 横長・横並びカードレイアウト (グリッド利用) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
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
                      <p className="text-yellow-400 mt-2">ごめんなさい、条件に合うお店が見つかりませんでした💦</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. 入力フォームエリア (自然なドキュメントフローで極力余白を減らす) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-2 md:px-6 pt-1 pb-4 mt-auto">
        <div className="flex items-center gap-2 bg-slate-700/95 border border-orange-400/70 rounded-full p-1 pl-4 shadow-[0_0_15px_rgba(249,115,22,0.4)] backdrop-blur-md focus-within:shadow-[0_0_20px_rgba(249,115,22,0.7)] focus-within:border-orange-400 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            placeholder="濃厚な豚骨ラーメンが食べたいな..."
            className="flex-grow bg-transparent text-slate-100 placeholder-slate-300 focus:outline-none text-sm md:text-base py-1.5"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`shrink-0 p-2 md:p-3 rounded-full transition-all duration-300 ${
              inputText.trim() && !isLoading
                ? "bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.8)] hover:bg-orange-400 hover:scale-105"
                : "bg-slate-600 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} className={isLoading ? "animate-pulse" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}