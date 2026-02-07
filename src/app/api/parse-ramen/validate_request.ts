// src/app/api/parse-ramen/validate_request.ts
import { schemas } from "@/types/zod-schemas";
import { CustomError } from "@/lib/CustomError";
import { z } from "zod";

/**
 * RequestオブジェクトからBodyを取り出し、Zodで検品します。
 * 不備がある場合は CustomError (400) を投げます。
 */
export async function validate_request(req: Request) {
  try {
    // 1. RequestからJSONを抽出
    // JSONの形式自体が壊れている場合はここでエラー（SyntaxError）が発生します
    const body = await req.json().catch(() => {
      throw new CustomError(400, "INVALID_JSON", "JSONの形式が正しくありません。");
    });

    // 2. Zodで構造をチェック
    // ParseRamenRequestはapi.yamlで定義した text を含むスキーマ
    return schemas.ParseRamenRequest.parse(body);

  } catch (e) {
    // 既に CustomError が投げられている場合はそのまま外へ流す
    if (e instanceof CustomError) {
      throw e;
    }

    // Zodのバリデーションエラーの場合
    if (e instanceof z.ZodError) {
      throw new CustomError(
        400,
        "BAD_REQUEST",
        "入力内容が不足しているか、形式が正しくありません。"
      );
    }

    // それ以外の予期せぬエラー
    throw new CustomError(500, "INTERNAL_SERVER_ERROR", "RequestValidation中にエラーが発生しました。");
  }
}