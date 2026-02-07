// src/app/api/parse-ramen/fetch_ai_analysis.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CustomError } from "@/lib/CustomError";

// APIキーのチェック（ランタイムエラーを防ぐ）
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}
// Geminiクライアントの初期化
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Gemini APIを呼び出し、AIによる解析結果を取得します。
 * API接続に失敗した場合は CustomError (503) を投げます。
 */
export async function fetch_ai_analysis(prompt: string) {
  try {
    // モデルの初期化（レスポンス形式をJSONに固定）
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    // AIへのプロンプト送信と回答取得
    const result = await model.generateContent(prompt);

    // 回答が空、あるいはブロックされた場合の最低限のチェック
    if (!result.response) {
      throw new CustomError(
        503,
        "AI_EMPTY_RESPONSE",
        "AIからの回答が空でした。内容を変えて試してください。"
      );
    }

    return result;
  } catch (e) {
    // ネットワークエラー、API制限（429）、認証エラーなどはここでキャッチ
    console.error("Gemini API Error:", e);

    throw new CustomError(
      503,
      "AI_SERVICE_UNAVAILABLE",
      "AIとの通信に失敗しました。しばらく時間を置いてから再度お試しください。",
    );
  }
}
