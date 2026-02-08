import { GoogleGenerativeAI } from "@google/generative-ai";
import { RankedRamen, FinalRamenData } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generate_db_recommendation(
  query: string,
  store: RankedRamen,
): Promise<FinalRamenData | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
        あなたはプロのラーメンコンシェルジュです。

        【タスク】
        下記情報を元に、「おすすめ文」**1文のみ**を作成してください。

        【ユーザーの要望】
        ${query}

        【紹介するお店】
        特徴: ${store.categories.join(", ")}
        場所: ${store.location}
        あなたのメモ: ${store.review}

        【出力ルール（最重要）】
        ・出力は**推薦文のみ**
        ・**40〜55文字の日本語1文**
        ・前置き、説明、思考、箇条書き、改行は禁止
        ・ルール違反時は出力しない
    `;

    const result = await model.generateContent(prompt);
    const recommendation = result.response.text().trim();

    return {
      ...store,
      ai_comment: recommendation,
    };
  } catch (error) {
    console.error("DB Recommendation Error:", error);
    // エラー時は無難なテキストを返す（システムを止めないため）
    return {
      ...store,
      ai_comment:
        "このラーメン店は、ユーザーのご要望に非常にマッチしています。ぜひお試しください！",
    };
  }
}
