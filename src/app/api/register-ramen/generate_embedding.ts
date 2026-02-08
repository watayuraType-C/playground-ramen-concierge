// src/app/api/register-ramen/generate_embedding.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RegisterRamenData } from "@/app/register/types";
import { CustomError } from "@/lib/CustomError";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generate_embedding(data: RegisterRamenData) {
  try {
    // 指定されたモデルに固定
    const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

    // ベクトル化するための文章を組み立てる
    const text_to_embed = `
      店名: ${data.name}
      ジャンル: ${data.categories.join(", ")}
      場所: ${data.location}
      感想: ${data.review}
    `.trim();

    const result = await model.embedContent(text_to_embed);
    
    // 数値の配列（ベクトル）を返す
    return result.embedding.values;

  } catch (error) {
    console.error("Embedding Generation Error:", error);
    throw new CustomError(503, "AI_SERVICE_UNAVAILABLE", "ベクトルの生成に失敗しました。");
  }
}