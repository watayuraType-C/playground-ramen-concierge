import { CustomError } from "@/lib/CustomError";
import { FinalRamenData, SafeSearchRamenResult, SearchRamenResponse } from "./types";

/**
 * unknown型のデータを検証し、SafeSearchRamenResult型として抽出する
 * 失敗したらエラーを投げる
 */
function parse_as_safe_result(data: unknown, source_label: string): SafeSearchRamenResult {
  // 1. オブジェクトかどうかチェック
  if (typeof data !== "object" || data === null) {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] データがオブジェクトではありません。`);
  }

  // 2. プロパティアクセス用に Record<string, unknown> にキャスト
  // これにより、data.name ではなく record['name'] として安全にアクセス可能
  const record = data as Record<string, unknown>;

  // 3. 各フィールドの厳密な型チェックと抽出 (バリデーション)
  
  // name (string)
  if (typeof record.name !== "string") {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'name' が文字列ではありません。`);
  }

  // categories (string[])
  if (!Array.isArray(record.categories) || !record.categories.every(c => typeof c === "string")) {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'categories' が文字列の配列ではありません。`);
  }

  // rating (number)
  // 文字列で "5" と来る場合も考慮して変換するか、厳格に number のみを許すか。
  // ここではAIの揺らぎを許容して Number() で変換を試みる安全策をとります。
  const rating = Number(record.rating);
  if (isNaN(rating)) {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'rating' が数値ではありません。`);
  }

  // location (string)
  if (typeof record.location !== "string") {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'location' が文字列ではありません。`);
  }

  // review (string)
  if (typeof record.review !== "string") {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'review' が文字列ではありません。`);
  }

  // ai_comment (string)
  if (typeof record.ai_comment !== "string") {
    throw new CustomError(500, "RESPONSE_FORMAT_ERROR", `[${source_label}] 'ai_comment' が文字列ではありません。`);
  }

  // similarity (number)
  // オプショナルまたはnullの場合は 0 にする
  let similarity = 0;
  if (typeof record.similarity === "number") {
    similarity = record.similarity;
  }

  // 4. クリーンなオブジェクトを生成して返す (ここで embedding などは消滅する)
  return {
    name: record.name,
    categories: record.categories,
    rating: rating,
    location: record.location,
    review: record.review,
    similarity: similarity,
    ai_comment: record.ai_comment,
  };
}

/**
 * メイン関数
 * 引数は FinalRamenData | null だが、検証関数へは unknown として渡すことで
 * 「型定義を過信せず、実データを検証する」姿勢を貫く
 */
export function validate_response(
  db_match: FinalRamenData | null,
  web_proposal: FinalRamenData | null
): SearchRamenResponse {
  
  const result: SearchRamenResponse = {
    db_match: [],
    web_match: []
  };

  // DBデータの検証
  if (db_match) {
    try {
      // 信頼できる内部データだが、embedding除去のためにパースを通す
      const safe_item = parse_as_safe_result(db_match, "DB_MATCH");
      result.db_match.push(safe_item);
    } catch (error) {
      console.error("Validation Error (DB):", error);
      // DBデータが不正な場合は空配列のまま
    }
  }

  // Webデータの検証
  if (web_proposal) {
    try {
      // AI生成データは信頼できないので厳格にチェック
      const safe_item = parse_as_safe_result(web_proposal, "WEB_MATCH");
      result.web_match.push(safe_item);
    } catch (error) {
      console.error("Validation Error (Web):", error);
      // AI生成形式ミスの場合は除外
    }
  }

  return result;
}