// src/app/api/search-ramen/route.ts
import { NextResponse } from "next/server";
import { validate_request } from "./validate_request";
import { create_embedding } from "./create_embedding";
import { fetch_all_ramen_stores } from "./fetch_all_ramen_stores"; // ★取得
import { rank_ramen_by_similarity } from "./rank_ramen_by_similarity"; // ★計算
import { generate_db_recommendation } from "./generate_db_recommendation";
import { suggest_web_ramen } from "./suggest_web_ramen";
import { validate_response } from "./validate_response";
import { CustomError } from "@/lib/CustomError";


export async function POST(req: Request) {
  try {
    // 1. バリデーション
    const { text } = await validate_request(req);

    // 2. ベクトル化 (Embedding)
    const query_vector = await create_embedding(text);

    // 3. DBから登録されているラーメン店データを全件取得
    const all_rows = await fetch_all_ramen_stores();

    // 4. 類似度計算とランキング
    const best_db_match = rank_ramen_by_similarity(all_rows, query_vector);

    // 5. AI処理の並列実行
    const [db_match, web_proposal] = await Promise.all([
      // ★DB推薦文生成
      generate_db_recommendation(text, best_db_match),
      // ★Web提案生成
      suggest_web_ramen(text, best_db_match)
    ]);

    // 6. レスポンスの構築
    const response_payload = validate_response(db_match, web_proposal);

    return NextResponse.json(response_payload);

  } catch (error) {
    console.error("Search API Error:", error);

    if (error instanceof CustomError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "予期せぬエラーが発生しました。", code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}