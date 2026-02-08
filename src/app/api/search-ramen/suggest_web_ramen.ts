// src/app/api/search-ramen/suggest_web_ramen.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RegisterRamenData } from "@/app/register/types"; // 型を追加
import { FinalRamenData } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function suggest_web_ramen(
  query: string,
  db_match_shop: RegisterRamenData,
): Promise<FinalRamenData | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    // ★追加：DBヒット時の文脈情報を作成
    const preference_context = db_match_shop 
      ? `【ユーザーの好みの傾向】
         過去のログから「${db_match_shop.name}」（特徴: ${db_match_shop.categories.join(", ")}）がヒットしました。
         この店と系統や味が近く、かつユーザーの要望を満たす店を優先的に提案してください。`
      : "";

    const prompt = `
      あなたはラーメンの専門家です。
      ユーザーの要望に基づき、実在する有名なラーメン店を「1つだけ」提案してください。
      ただし、以下のリストにある店は除外してください。
      除外リスト: [${db_match_shop.name}]

      【ユーザーの要望】
      ${query}

      ${preference_context}

      【出力フォーマット（JSON）】
      必ず以下のJSON形式のみを出力してください。Markdownの装飾は不要です。
      {
        "name": "正式な店名",
        "categories": ["ジャンル1", "ジャンル2"],
        "rating": 5,
        "location": "市区町村（例：横浜市西区）",
        "review": "お店の代表的な特徴や味の感想（客観的な事実に基づいたもの）",
        "similarity": null,
        "ai_comment": "この店を選んだ理由とおすすめポイント。DBの「${db_match_shop?.name || '好み'}」とどう似ているかにも触れてください。（100文字以内）"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // JSONとしてパースして返す
    return JSON.parse(text) as FinalRamenData;

  } catch (error) {
    console.error("Web Suggestion Error:", error);
    return null;
  }
}