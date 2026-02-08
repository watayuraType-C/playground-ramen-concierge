// src/app/api/register-ramen/check_connection.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { CustomError } from "@/lib/CustomError";

/**
 * DBサーバーが起きているか、接続可能かを確認します。
 */
export async function check_connection(supabase: SupabaseClient) {
  try {
    // どんなテーブルでもいいので、1件だけデータを取得しようとしてみる
    // データの中身はいらないので、生存確認のみ目的
    const { error } = await supabase.from('ramen_stores').select('id').limit(1);

    if (error) {
      // プロジェクトが一時停止（Paused）している場合や、ネットワークエラー
      console.error("Supabase Health Check Error:", error);
      throw new CustomError(503, "DATABASE_SERVICE_UNAVAILABLE", "DBサーバーが応答しません。スリープ中の可能性があります。");
    }
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(503, "DATABASE_CONNECTION_ERROR", "DBへの接続に失敗しました。");
  }
}