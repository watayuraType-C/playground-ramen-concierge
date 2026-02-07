import { NextResponse } from "next/server";
import { CustomError } from "@/lib/CustomError";
import { validate_request } from "./validate_request";
import { generate_prompt } from "./generate_prompt";
import { fetch_ai_analysis } from "./fetch_ai_analysis";
import { validate_response } from "./validate_response";


export async function POST(req: Request) {
  try {
    // 1. Requestを検品して、中身（text）を取り出す
    const { text } = await validate_request(req);
    // 2. プロンプトを生成
    const prompt = generate_prompt(text);
    // 3. LLMから回答を取得
    const result = await fetch_ai_analysis(prompt);
    // 4. LLMからの加藤の解析・検品フェーズ
    const validated_result = validate_response(result);

    return NextResponse.json(validated_result);

  } catch (error) {
  // 自作のエラー（CustomError）が発生した場合
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: error.status }
      );
    }

    // それ以外の予期せぬエラー（500）
    console.error("Unexpected Route Error:", error);
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "予期せぬエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}