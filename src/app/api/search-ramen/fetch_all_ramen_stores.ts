// src/app/api/search-ramen/fetch_all_ramen_stores.ts
import { createClient } from "@supabase/supabase-js";
import { CustomError } from "@/lib/CustomError";
import { RamenRow } from "./types";

export async function fetch_all_ramen_stores(): Promise<RamenRow[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: rows, error } = await supabase
    .from("ramen_stores")
    .select("*");

  if (error) {
    console.error("DB Fetch Error:", error);
    throw new CustomError(503, "DATABASE_CONNECTION_ERROR", "ラーメンデータの取得に失敗しました。");
  }

  if (!rows || rows.length === 0) {
    throw new CustomError(404, "NO_RAMEN_DATA", "ラーメンデータが見つかりません。");
  }

  return (rows as RamenRow[]);
}