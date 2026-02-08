// src/app/api/register-ramen/connect_db.ts
import { createClient } from '@supabase/supabase-js';
import { CustomError } from "@/lib/CustomError";

export function connect_db() {

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new CustomError(503, "DATABASE_CONNECTION_ERROR", "DB接続設定が不足しています。");
    }

    // クライアントを生成して返す
    return createClient(url, key);
  } catch (error) {
    console.error("Database Connection Initialization Error:", error);
    if (error instanceof CustomError) throw error;
    throw new CustomError(503, "DATABASE_CONNECTION_ERROR", "DBへの接続に失敗しました。");
  }
}