import { GoogleGenerativeAI } from "@google/generative-ai";
import { CustomError } from "@/lib/CustomError";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * 任意のテキストをベクトル化する汎用関数
 * @param text ベクトル化したい文字列
 * @returns 768次元の数値配列
 */
export async function create_embedding(text: string): Promise<number[]> {
  try {
    // 登録時と同じモデルを指定（これがズレると検索できません）
    const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

    // 改行などをスペースに置換して、1行のテキストとして整形
    const cleaned_text = text.replace(/\n/g, " ").trim();

    const result = await model.embedContent(cleaned_text);
    return result.embedding.values;

  } catch (error) {
    console.error("Create Embedding Error:", error);
    throw new CustomError(503, "AI_SERVICE_UNAVAILABLE", "検索ワードのベクトル化に失敗しました。");
  }
}