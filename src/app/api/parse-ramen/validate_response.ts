// src/app/api/parse-ramen/validate_response.ts
import { schemas } from "@/types/zod-schemas";
import { CustomError } from "@/lib/CustomError";
import { GenerateContentResult } from "@google/generative-ai";
import { z } from "zod";

/**
 * AIからの回答を検品・成形します。
 * 形式が不適切な場合は 422 (Unprocessable Entity) を投げます。
 */
export function validate_response(result: GenerateContentResult) {
  let raw_json_result: unknown;

  // 1. JSONパースの試行
  try {
    const response_text = result.response.text();
    raw_json_result = JSON.parse(response_text);
  } catch (error) {
    // 詳細なエラーログを出す
    console.error("JSON Parse Error Details:", error);
    // AIが壊れたJSONを返した、またはテキストが取得できなかった場合
    throw new CustomError(422, "PARSE_FAILURE", `AIの回答形式が正しくありませんでした。`);
  }

  // 2. オブジェクトであることの確認（Type Guard）
  if (typeof raw_json_result !== "object" || raw_json_result === null) {
    throw new CustomError(422, "INVALID_FORMAT", "AIの回答がオブジェクトではありませんでした。");
  }

  // 3. 一時的なプロパティアクセスのための型定義
  const json_result = raw_json_result as Record<string, unknown>;

  // 4. 前処理と型変換
  // rating の処理（数値化 -> 四捨五入 -> 1-5範囲チェック）
  let cleaned_rating: number | null = null;
  try {
    const raw_rating = json_result.rating;
    if (raw_rating !== undefined && raw_rating !== null) {
      const parsed_num = Math.round(Number(raw_rating));
      if (!isNaN(parsed_num) && parsed_num >= 1 && parsed_num <= 5) {
        cleaned_rating = parsed_num;
      }
    }
  } catch {
    // エラーが起きたら、cleaned_rating は null に設定
    cleaned_rating = null; // エラーが起きても安全にnull
  }
  const cleaned_data = {
    ...json_result,
    // categories: 配列でなければ []
    categories: Array.isArray(json_result.categories) ? json_result.categories : [],
    // rating: 上記の判定結果を適用
    rating: cleaned_rating,
    // location: stringでなければ null
    location: typeof json_result.location === "string" ? json_result.location : null,
    // review: stringでなければ null
    review: typeof json_result.review === "string" ? json_result.review : null,
  };

  // 5. Zodによる最終検品
  try {
    return schemas.RamenData.parse(cleaned_data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.errors);
      throw new CustomError(422, "INVALID_AI_RESPONSE", "解析データが不完全です。");
    }
    throw error;
  }
}