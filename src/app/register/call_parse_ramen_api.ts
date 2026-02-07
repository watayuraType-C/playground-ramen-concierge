// src/app/register/call_parse_ramen_api.ts
import { schemas } from "@/types/zod-schemas";

/**
 * AI解析APIを呼び出します。
 * ステータスコードに応じたエラーメッセージを返します。
 */
export async function call_parse_ramen_api(text: string) {
  // フロントエンド側での最低限のチェック
  if (!text.trim()) {
    throw new Error("メモを入力してください。");
  }
  // APIエンドポイントを呼び出す
  const response = await fetch("/api/parse-ramen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  // レスポンスをJSONとしてパース
  const data = await response.json();

  if (!response.ok) {
    // api.yaml で定義した ErrorResponse の形式でエラーが返ってくることを期待
    throw new Error(data.message || "解析に失敗しました。");
  }

  // 成功時は RamenData の形式で返す
  return schemas.RamenData.parse(data);
}