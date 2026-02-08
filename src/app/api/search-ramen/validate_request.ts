// src/app/api/search-ramen/validate_request.ts
import { CustomError } from "@/lib/CustomError";

// バリデーションを通ったあとの型定義
type ValidatedRequest = {
  text: string;
};

export async function validate_request(req: Request): Promise<ValidatedRequest> {
  let body;
  try {
    body = await req.json();
  } catch {
    // JSONとして壊れている場合（構文エラーなど）
    throw new CustomError(400, "INVALID_JSON", "リクエストボディが正しいJSON形式ではありません。");
  }

  const { text } = body;

  // 必須チェック、型チェック、文字数チェック
  if (!text || typeof text !== "string" || text.trim().length === 0 || text.length > 1000) {
    throw new CustomError(
      400, 
      "VALIDATION_ERROR", 
      "検索テキストは1文字以上1000文字以内で入力してください。"
    );
  }

  return { text };
}