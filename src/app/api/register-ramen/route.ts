// src/app/api/register-ramen/route.ts
import { NextResponse } from "next/server";
import { CustomError } from "@/lib/CustomError";
import { validate_request } from "./validate_request";
import { connect_db } from "./connect_db";
import { check_connection } from "./check_connection";
import { generate_embedding } from "./generate_embedding";
import { register_db } from "./register_db";

export async function POST(req: Request) {
  try {
    // 1. リクエスト検品
    const validated_data = await validate_request(req);

    // 2. クライアント初期化（環境変数チェック）
    const supabase = connect_db();

    // 3. 生存確認 (503チェック) ★ここが追加！
    await check_connection(supabase);

    // 4. RAG用のベクトル生成
    const embedding = await generate_embedding(validated_data);

    // 5. 登録実行
    const result = await register_db(supabase, validated_data, embedding);

    return NextResponse.json({
      id: result.id,
      message: "ラーメン情報の登録が完了しました！"
    }, { status: 201 });

  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { message: "予期せぬエラーが発生しました。", code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}