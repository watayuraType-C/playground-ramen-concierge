// src/app/api/register-ramen/validate_request.ts
import { schemas } from "@/types/zod-schemas";
import { CustomError } from "@/lib/CustomError";

export async function validate_request(req: Request) {
  try {
    const body = await req.json();
    // 厳格な方のスキーマでバリデーション
    return schemas.RegisterRamenData.parse(body);
  } catch {
    throw new CustomError(400, "BAD_REQUEST", "登録データが正しくありません。");
  }
}