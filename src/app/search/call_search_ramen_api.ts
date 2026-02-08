// src/app/search/call_search_ramen_api.ts
import { SearchResponse } from "./types";

/**
 * 検索API (/api/search-ramen) を呼び出す関数
 * @param text ユーザーの検索クエリ（例: "横浜のこってりした家系ラーメン"）
 * @returns 検索結果（DBのログ + Webの提案）
 */
export async function call_search_ramen_api(text: string): Promise<SearchResponse> {
  try {
    const response = await fetch("/api/search-ramen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    // レスポンスが 200 OK 以外の場合
    if (!response.ok) {
      // サーバーから返ってきたエラーメッセージ（JSON）を取得してみる
      const error_data = await response.json().catch(() => null);
      
      // JSONにmessageが含まれていればそれを、なければステータスコードを表示
      const error_message = error_data?.message || `検索エラーが発生しました (Status: ${response.status})`;
      throw new Error(error_message);
    }

    // 成功時
    const data = await response.json();
    return data as SearchResponse;

  } catch (error) {
    // ネットワークエラーなどをコンソールに出しつつ、呼び出し元へエラーを投げる
    console.error("Search API Call Error:", error);
    throw error;
  }
}